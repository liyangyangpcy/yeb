<!-- 权限组主要用来更新以及展示不同的角色所拥有的不同的菜单的一个权限 
角色操作：角色的添加/查询/删除 以及跟角色相关的一个菜单的一个权限的一个操作 如整个菜单权限的展示，每一个角色对应的菜单权限的展示 以及更新角色菜单权限
-->
<template>
    <div style="width:600px">
        <div class="permissManaTool">
            <!-- Input输入框 效果 前缀-->
             <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名"
                      @keydown.enter.native="doAddRole">
            </el-input>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="doAddRole">添加角色</el-button>
        </div>
         <!-- Collapse折叠面板 效果  activeName 默认激活名字通过 accordion 属性来设置是否以手风琴模式显示。change当前激活面板改变时触发(如果是手风琴模式，参数 activeNames 类型为string，否则为array)-->
        <div class="permissManaMain">
            <el-collapse v-model="activeName" accordion @change="change">
                <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r,index) in roles" :key="index">
                     <!--Card卡片 效果-->
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问资源</span>
                               <!--删除角色-->
                            <el-button style="float: right; padding: 3px 0;color: #ff0000" icon="el-icon-delete" type="text" @click="doDeleteRole(r)">
                            </el-button>
                        </div>
                        <div>
                             <!--Tree树形控件 可选择 show-checkbox 可以展示checkbox ，默认展开和默认选中： :default-checked-keys具体值 default-checked-keys字符串 分别通过default-expanded-keys和default-checked-keys设置默认展开和默认选中的节点。需要注意的是，此时必须设置node-key，其值为节点数据中的一个字段名，该字段在整棵树中是唯一的。
                              ref="tree" 获取整个树    :key="index" 树形控件区分-->
                            <el-tree
                                    show-checkbox
                                    node-key="id"
                                    ref="tree"
                                    :key="index"
                                    :default-checked-keys="selectedMenus"
                                    :data="allMenus" 
                                    :props="defaultProps">
                            </el-tree>
                            <div style="display: flex;justify-content: flex-end">
                                <el-button @click="cancelUpdate">取消修改</el-button>
                                <el-button type="primary" @click="doUpdate(r.id,index)">确认修改</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissMana",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: ''
               },
                roles: [],
                allMenus: [],
                selectedMenus: [],               //选中数组
                activeName: -1,                  //折叠面板关闭
                defaultProps: {
                    children: 'children',        //子树为指定节点对象里的某个属性值 不像easyui是可以变更vaule
                    label: 'name'                 //节点标签为节点对象的某个属性值 如果allmunus里返回的是lable甚至可以不写
               }
           }
       },
        mounted() {
            this.initRoles();
       },
        methods: {
            doDeleteRole(role){
                this.$confirm('此操作将永久删除该【' + role.nameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
               }).then(() => {
                    this.deleteRequest('/system/basic/permiss/role/' +role.id).then(resp => {
                        if (resp) {
                            this.initRoles();
                       }
                   });
               }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                   });
               });
           },
            doAddRole(){
                if (this.role.name&&this.role.nameZh){
                   this.postRequest('/system/basic/permiss/role',this.role).then(resp=>{
                        if (resp){
                            this.initRoles();  //初始化角色表
                            this.role.name='';
                            this.role.nameZh='';
                       }
                   })
               } else {
                    this.$message.error('字段不能为空!');
               }
           },
            cancelUpdate() {
                this.activeName = -1;
           },
            doUpdate(rid, index) {            //修改角色菜单
                let tree = this.$refs.tree[index];    //有6个tree，传index
                let selectedKeys = tree.getCheckedKeys(true);   //getCheckedKeys 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
                let url = '/system/basic/permiss/?rid=' + rid;
                selectedKeys.forEach(key => {
                    url += '&mids=' + key;
               })
                this.putRequest(url).then(resp => {
                    if (resp) {
                        this.activeName = -1;
                    }
                })
           },
            change(rid) {
                if (rid) {
                    this.initAllMenus();
                    this.initSelectedMenus(rid);
               }
           },
            initSelectedMenus(rid) {
                this.getRequest('/system/basic/permiss/mid/' + rid).then(resp =>{
                    this.selectedMenus = resp;
               })
           },
            initAllMenus() {
                this.getRequest('/system/basic/permiss/menus').then(resp => {
                    this.allMenus = resp;
               })
           },
            initRoles() {
                this.getRequest('/system/basic/permiss/').then(resp => {
                    if (resp) {
                        this.roles = resp;
                   }
               })
           }
       }
   }
</script>
<style>
    .permissManaTool{
      display:flex ;
      justify-content:flex-start ;
    }
   
    .permissManaTool .el-input{ 
      width: 300px;           
      margin-right: 6px;
    }
    .permissManaMain{
      margin-top:10px ;
      width: 700px;
    }
</style>