class NewComicSource extends ComicSource {  // 首行必须为class...
    /*
    ComicSource 定义
    ```
    class ComicSource {
        name = ""

        key = ""

        version = ""

        minAppVersion = ""

        url = ""

        loadData(dataKey) {
            return sendMessage({
                method: 'load_data',
                key: this.key,
                data_key: dataKey
            })
        }

        // save data
        // ```
        // this.saveData('id', 1)
        // this.saveData('info', {
        //    name: '',
        //    age: 16
        // })
        // ```
        saveData(dataKey, data) {
            return sendMessage({
                method: 'save_data',
                key: this.key,
                data_key: dataKey,
                data: data
            })
        }

        deleteData(dataKey) {
            return sendMessage({
                method: 'delete_data',
                key: this.key,
                data_key: dataKey,
            })
        }

        init() { }
    }
    ```
    */

    // 此漫画源的名称
    name = ""

    // 唯一标识符
    key = ""

    version = "1.0.0"

    minAppVersion = "3.1.0"

    // 更新链接
    url = ""

    /// APP启动时或者添加/更新漫画源时执行此函数
    init() {

    }

    /// 账号
    /// 设置为null禁用账号功能
    account = {
        /// 登录
        /// 返回任意值表示登录成功
        login: async (account, pwd) => {
            /*
            使用Network发起网络请求
            cookie相关数据将被自动保存
            其他数据需要使用`this.saveData`保存
            ```
            let res = await Network.post('https://example.com/login', {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }, `account=${account}&password=${pwd}`)

            if(res.status == 200) {
                let json = JSON.parse(res.body)
                this.saveData('token', json.token)
                return 'ok'
            }

            throw 'Failed to login'
            ```
            */

        },

        // 退出登录时将会调用此函数
        logout: () => {
            /*
            ```
            this.deleteData('token')
            Network.deleteCookies('https://example.com')
            ```
            */
        },

        registerWebsite: "https://www.copymanga.site/web/login/loginByAccount"
    }

    /// 探索页面
    /// 一个漫画源可以有多个探索页面
    explore = [
        {
            /// 标题
            /// 标题同时用作标识符, 不能重复
            title: "拷贝漫画",

            /// singlePageWithMultiPart 或者 multiPageComicList
            type: "singlePageWithMultiPart",

            /*
            加载漫画
            如果类型为multiPageComicList, load方法应当接收一个page参数, 并且返回漫画列表
            ```
            load: async (page) => {
                let res = await Network.get("https://example.com")

                if (res.status !== 200) {
                    throw `Invalid status code: ${res.status}`
                }

                let data = JSON.parse(res.body)

                function parseComic(comic) {
                    // ...

                    return {
                        id: id,
                        title: title,
                        subTitle: author,
                        cover: cover,
                        tags: tags,
                        description: description
                    }
                }

                return {
                    comics: data.list.map(parseComic),
                    maxPage: data.maxPage
                }
            }
            ```
            */
            load: async () => {
                /*
                ```
                let res = await Network.get("https://example.com")

                if (res.status !== 200) {
                    throw `Invalid status code: ${res.status}`
                }

                let data = JSON.parse(res.body)

                function parseComic(comic) {
                    // ...

                    return {
                        id: id,
                        title: title,
                        subTitle: author,
                        cover: cover,
                        tags: tags,
                        description: description
                    }
                }

                let comics = {}
                comics["推荐"] = data["results"]["recComics"].map(parseComic)
                comics["热门"] = data["results"]["hotComics"].map(parseComic)
                comics["最新"] = data["results"]["newComics"].map(parseComic)

                return comics
                ```
                */
            }
        }
    ]

    /// 分类页面
    /// 一个漫画源只能有一个分类页面, 也可以没有, 设置为null禁用分类页面
    category = {
        /// 标题, 同时为标识符, 不能与其他漫画源的分类页面重复
        title: "",
        parts: [
            {
                name: "主题",

                // fixed 或者 random
                // random用于分类数量相当多时, 随机显示其中一部分
                type: "fixed",

                // 如果类型为random, 需要提供此字段, 表示同时显示的数量
                // randomNumber: 5,

                categories: ["全部", "冒险", "奇幻", "百合", "校园"],

                // category或者search
                // 如果为category, 点击后将进入分类漫画页面, 使用下方的`categoryComics`加载漫画
                // 如果为search, 将进入搜索页面
                itemType: "category",

                // 若提供, 数量需要和`categories`一致, `categoryComics.load`方法将会收到此参数
                categoryParams: ["", "maoxian", "qihuan", "baihe", "xiaoyuan"]
            }
        ],
        enableRankingPage: false,
    }

    /// 分类漫画页面, 即点击分类标签后进入的页面
    categoryComics = {
        load: async (category, param, options, page) => {
            /*
            加载漫画
            category和param参数来自分类页面, options类型为[]string, 来自下方optionList, 顺序保持一致
            ```
            let data = JSON.parse((await Network.get('...')).body)
            let maxPage = data.maxPage

            function parseComic(comic) {
                // ...

                return {
                    id: id,
                    title: title,
                    subTitle: author,
                    cover: cover,
                    tags: tags,
                    description: description
                }
            }

            return {
                comics: data.list.map(parseComic),
                maxPage: maxPage
            }
            ```
            */
        },
        // 提供选项
        optionList: [
            {
                // 对于单个选项, 使用-分割, 左侧为用于数据加载的值, 即传给load函数的options参数; 右侧为显示给用户的文本
                options: [
                    "*datetime_updated-时间倒序",
                    "datetime_updated-时间正序",
                    "*popular-热度倒序",
                    "popular-热度正序",
                ],
                // 提供[]string, 当分类名称位于此数组中时, 禁用此选项
                notShowWhen: null,
                // 提供[]string, 当分类名称没有位于此数组中时, 禁用此选项
                showWhen: null
            }
        ],
        ranking: {
            options: [
                "day-日",
                "week-周"
            ],
            load: async (option, page) => {
                
            }
        }
    }

    /// 搜索
    search = {
        load: async (keyword, options, page) => {
            /*
            加载漫画
            options类型为[]string, 来自下方optionList, 顺序保持一致
            ```
            let data = JSON.parse((await Network.get('...')).body)
            let maxPage = data.maxPage

            function parseComic(comic) {
                // ...

                return {
                    id: id,
                    title: title,
                    subTitle: author,
                    cover: cover,
                    tags: tags,
                    description: description
                }
            }

            return {
                comics: data.list.map(parseComic),
                maxPage: maxPage
            }
            ```
            */
        },

        // 提供选项
        optionList: [
            {
                // 使用-分割, 左侧用于数据加载, 右侧显示给用户
                options: [
                    "0-time",
                    "1-popular"
                ],
                // 标签
                label: "sort"
            }
        ]
    }

    /// 收藏
    favorites = {
        /// 是否为多收藏夹
        multiFolder: false,
        /// 添加或者删除收藏
        addOrDelFavorite: async (comicId, folderId, isAdding) => {
            /*
            返回任意值表示成功
            抛出错误`Login expired`表示登录到期, App将会自动重新登录并且重新加载
            ```
            if (res.status === 401) {
                throw `Login expired`;
            }
            ```
            不需要考虑未登录的情况, 未登录时不会调用此函数
            */
        },
        // 加载收藏夹, 仅当multiFolder为true时有效
        // 当comicId不为null时, 需要同时返回包含该漫画的收藏夹
        loadFolders: async (comicId) => {
            /*
            ```
            let data = JSON.parse((await Network.get('...')).body)

            let folders = {}

            data.folders.forEach((f) => {
                folders[f.id] = f.name
            })

            return {
                // map<string, string> key为收藏夹id, value为收藏夹名称, id用于收藏夹相关内容的加载
                folders: folders,
                // string[]?, 包含comicId的收藏夹, 若comicId为空, 则此字段为空
                favorited: data.favorited
            }
            ```
            */
        },
        /// 加载漫画
        loadComics: async (page, folder) => {
            /*
            加载漫画
            同上, 抛出错误`Login expired`表示登录到期, App将会自动重新登录并且重新加载
            如果为非多收藏夹式, 参数folder为null
            ```
            let data = JSON.parse((await Network.get('...')).body)
            let maxPage = data.maxPage

            function parseComic(comic) {
                // ...

                return {
                    id: id,
                    title: title,
                    subTitle: author,
                    cover: cover,
                    tags: tags,
                    description: description
                }
            }

            return {
                comics: data.list.map(parseComic),
                maxPage: maxPage
            }
            ```
            */
        }
    }

    /// 单个漫画相关
    comic = {
        // 加载漫画信息
        loadInfo: async (id) => {
            /*
            ```
            // ...

            return {
                // string 标题
                title: title,
                // string 封面url
                cover: cover,
                // string
                description: description,
                // Map<string, string[]> | object 标签
                tags: {
                    "作者": authors,
                    "更新": [updateTime],
                    "标签": tags
                },
                // Map<string, string>? | object, key为章节id, value为章节名称
                // 注意: 为了保证章节顺序, 最好使用Map, 使用object不能保证顺序
                chapters: chapters,
                // bool 注意, 如果是多收藏式的网络收藏, 将此项设置为null, 从而可以在漫画详情页面, 对每个单独的收藏夹执行收藏或者取消收藏操作
                isFavorite: isFavorite,
                // string? 
                subId: comicData.uuid,
                // string[]?
                thumbnails: thumbnails
            }
            ```
            */
        },
        // 获取章节图片
        loadEp: async (comicId, epId) => {
            /*
            获取此章节所有的图片url
            ```
            return {
                // string[]
                images: images
            }
            ```
            */
        },
        // 可选, 调整图片加载的行为; 如不需要, 删除此字段
        onImageLoad: (url, comicId, epId) => {
            /*
            ```
            return {
                url: `${url}?id=comicId`,
                // http method
                method: 'GET',
                // any
                data: null,
                headers: {
                    'user-agent': 'pica_comic/v3.1.0',
                },
                // 参数data和返回值均为 `ArrayBuffer`
                // 注意: 使用此字段会导致图片数据被多次复制, 可能影响性能
                onResponse: (data) => {
                    return data
                }
            }
            ```
            */

            return {}
        },
        // 加载评论
        loadComments: async (comicId, subId, page, replyTo) => {
            /*
            ```
            // ...

            return {
                comments: data.results.list.map(e => {
                    return {
                        // string
                        userName: e.user_name,
                        // string
                        avatar: e.user_avatar,
                        // string
                        content: e.comment,
                        // string?
                        time: e.create_at,
                        // number?
                        replyCount: e.count,
                        // string
                        id: e.id,
                    }
                }),
                // number
                maxPage: data.results.maxPage,
            }
            ```
            */
        },
        // 发送评论, 返回任意值表示成功
        sendComment: async (comicId, subId, content, replyTo) => {

        }
    }
}