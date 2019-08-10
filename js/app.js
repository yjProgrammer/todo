(function(Vue) { //表示依赖了全局的vue
    //const表示申明的变量是不可变的，  ES6
    const items = [{
                id: 1, //主键id
                content: 'vue.js', //输入的内容
                completed: false //是否完成
            },
            {
                id: 2,
                content: 'java',
                completed: false
            },
            {
                id: 3,
                content: 'python',
                completed: false
            }
        ]
        //注册全局指令，指令名不要加上v-，引用才需要加上
    Vue.directive('app-focus', {
        inserted(el, binding) {
            //聚焦元素
            el.focus()
        },
        update(el, binding) {
            el.focus()
        }
    })

    var app = new Vue({
            el: '#todoapp',
            data() {
                return {
                    items, //ES6  这是对象属性的简写方式，等于items:items
                    currentItem: null, // 代表的是点击的那个任务项
                    filterStatus: 'all' //接受变换的值
                }
            },

            //定义计算属性
            computed: {
                filterItems() {
                    switch (this.filterStatus) {
                        case 'active':
                            //过滤出未完成的数据 filter
                            return this.items.filter((item) => !item.completed)
                            break;
                        case 'completed':
                            return this.items.filter((item) => item.completed)
                        default:
                            return this.items
                            break;
                    }
                },
                //剩余未完成任务数量
                toggleAll: {
                    //当任务列表中的状态发生变化后，就更新复选框的状态
                    get() {
                        console.log('get', this.remaining)
                        return this.remaining === 0
                    },
                    //当复选框的状态更新之后，则将任务列表中的状态更新
                    set(newStatus) {
                        console.log('set')
                            //当点击复选框之后，复选框的值会发生改变，就会触发set方法调用
                            //将迭代数组中的所有任务项，然后将当前复选框的状态值赋值给每一个任务的状态值
                        this.items.forEach((item) => { //ES6箭头函数 它是等价于function（item）{}
                            item.completed = newStatus
                        });
                    }
                },
                //剩余未完成任务数量
                remaining() {
                    //数组filter函数过滤过所有未完成的任务项
                    //unItems用于接收过滤之后的未完成的任务项，它是一个数组
                    const unItems = this.items.filter(function(item) {
                        return !item.completed
                    })
                    return unItems.length
                }
            },

            methods: {
                //完成编辑，保存数据
                finishEdit(item, index, event) {
                    // 1.获取当前输入框的值
                    const content = event.target.value.trim()
                        // 2.判断输入框的值是否为空，如果为空，则进行删除任务项
                    if (!content) {
                        this.removeItem(index)
                        return
                    }
                    // 3.如果不为空，则添加到任务项,做一个更新
                    item.content = content
                        // 4.移除editing样式，退出编辑状态
                    this.currentItem = null
                },

                //取消编辑
                cancelEdit() {
                    this.currentItem = null
                },

                //进入编辑状态
                toEdit(item) {
                    console.log(item)
                        //将点击的那个任务项item，赋值给currentItem，用于页面editing生效
                    this.currentItem = item
                },

                //移除所有已完成任务项
                removeCompleted() {
                    //过滤出所有未完成任务项，重新的将这个新数组（未完成任务项）
                    // this.items.filter(item=>{
                    // 	return item.completed
                    // })
                    this.items = this.items.filter(item => !item.completed)
                },
                //移除任务项
                removeItem(index) {
                    console.log(index)
                    this.items.splice(index, 1)
                        //index为移除的项，1为移除的项数
                },

                addItem(event) { //ES6语法，它等价于addItem:function()
                    console.log('addItem', event.target.value)
                        //1.获取文本框中的内容
                    const content = event.target.value.trim()
                        //2.判断数据是否为空，如果为空，什么都不做
                    if (!content.length) { //0：false   !false=true
                        return
                    }
                    //3.如果不为空，则添加到数组中
                    const id = this.items.length + 1
                    this.items.push({
                            id,
                            content,
                            completed: false
                        })
                        //4.清空文本输入框的内容
                    event.target.value = ''
                }
            },
        })
        //写在vue实例外面
    window.onhashchange = function() {
        //获取路由的hash值不为空的时候则返回，为空则返回null
        const hash = window.location.hash.substr(2) || 'all'

        app.filterStatus = hash
    }

    //第一次访问页面是，就让状态值生效
    window.onhashchange() //

})(Vue);