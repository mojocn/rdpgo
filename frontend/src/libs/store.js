import Vuex from 'vuex';
import Vue from 'vue';
import service from "@/libs/request";

Vue.use(Vuex);


const menuUser = [
    {
        txt: '个人中心',
        icon: 'el-icon-c-scale-to-original',
        subs: [
            {path: '/requisition-my', txt: '我的工单', name: 'requisitionMy'},
            {path: '/requisition-todo', txt: '我的审批', name: 'requisitionTodo'},
            //{path: '/machine-my', txt: '我的机器', name: 'machineMy'},
        ]
    },
]
const menuAdmin = [
    // {
    //     txt: '配置中心',
    //     icon: 'el-icon-setting',
    //     subs: [{path: '/approve-flow', txt: '授权管理', name: 'listApproveFlow'}]
    // },
    {
        txt: '个人中心',
        icon: 'el-icon-c-scale-to-original',
        subs: [
            {path: '/requisition-my', txt: '我的工单', name: 'requisitionMy'},
            {path: '/requisition-todo', txt: '我的审批', name: 'requisitionTodo'},
            // {path: '/machine-my', txt: '我的机器', name: 'machineMy'},
        ]
    },
    {
        txt: '系统管理',
        icon: 'el-icon-camera',
        subs: [
            {path: '/approve-flow', txt: '审批配置', name: 'listApproveFlow'},
            {path: '/user', txt: '用户管理', name: 'user'},
            //{path: '/machine-user', txt: '机器管理', name: 'machineUser'},
            {path: '/requisition', txt: '工单审计', name: 'requisition'},
            //{path: '/session-live', txt: '实时会话', name: 'sessionLive'},
            //{path: '/session-log', txt: '日志审计', name: 'sessionLog'},
        ]
    },
]


export default new Vuex.Store({
    state: {
        userPage: null,
        meta: null,
        user: null,
        todoCount: 0,//待审批信息数量
    },
    getters: {
        getWhiteRules(state) {
            let meta = state.meta
            if (!meta) {
                return []
            }
            return meta.rule_white
        },
        getBlackRules(state) {
            let meta = state.meta
            if (!meta) {
                return []
            }
            return meta.rule_black
        },
        getUserList(state) {
            let up = state.userPage
            if (!up) {
                return []
            }
            return state.userPage.list || []
        },
        getVersion(state) {
            return state.meta ? state.meta.version : []
        },
        getRequisitionStatus(state) {
            return state.meta ? state.meta.requisitionStatus : null
        },
        getTodoCount(state) {
            return state.todoCount
        },
        getUser(statue) {
            return statue.user
        },
        isAdmin(state, getters) {
            let user = getters.getUser
            return user ? user.role === 'admin' : false
        },
        getNavi(state, getters) {
            let user = getters.getUser
            if (user && user.role === 'admin') {
                return menuAdmin
            }
            return menuUser
        }
    },
    mutations: {
        setUserPage(state, page) {
            state.userPage = page
        },
        setMeta(state, obj) {
            state.meta = obj
        },
        setUser(state, obj) {
            state.user = obj
        },
        setTodoCount(state, obj) {
            state.todoCount = obj
        }
    },
    actions: {
        fetchMeta({commit}) {
            service.get("/api/meta").then(res => {
                if (res) {
                    commit('setMeta', res)
                }
            })
        },
        fetchUserList({commit}, q) {
            service.get("/api/user", {params: q}).then(res => {
                commit('setUserPage', res)
            })
        },
        fetchRequisitionTodoCount({commit}) {
            service.get("/api/requisition-todo-count").then(res => {
                if (Number.isInteger(res)) {
                    commit('setTodoCount', res)
                }
            })
        }
    },
});
