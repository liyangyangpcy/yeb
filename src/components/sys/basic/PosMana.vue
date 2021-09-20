<template>
    <div>
         <div>
           <!-- input输入框 效果   icon图标 绑定 键盘事件：键盘回车以后直接触发事件-->
            <el-input
                    size="small"
                    class="addPosInput"
                    placeholder="添加职位..."
                    prefix-icon="el-icon-plus"            
                    @keydown.enter.native="addPosition"
                    v-model="pos.name">
            </el-input>
             <!-- button按钮 效果-->
            <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
        </div>
        <!-- Table表格  当el-table元素中注入data对象数组后，在el-table-column中用prop属性来对应对象中的键名即可填入数据，
                        用label属性来定义表格的列名。
                        可以使用width属性来定义列宽。
                        stripe属性可以创建带斑马纹的表格。它接受一个Boolean，默认为false，设置为true即为启用
                        默认情况下，Table 组件是不具有竖直方向的边框的，如果需要，可以使用border属性，它接受一个Boolean，设置为true即可启用。    
                        多选  @selection-change="handleSelectionChange" 选项改变的事件
        -->
        <div class="posManaMain">
            <el-table
                    :data="positions"
                    border
                    stripe
                    size="small"
                    @selection-change="handleSelectionChange"
                    style="width: 70%">
                  <!--  Table表格 多选框 效果-->
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职位名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        
                        label="创建时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                         <!--  Table表格  scope范围 index这一行的索引下标 scope.row这一行的数据（json数据）-->
                        <el-button size="mini" @click="showEditView(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini"  type="danger" @click="handleDelete(scope.$index, scope.row)">删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
                <!--  :disabled="multipleSelection.length==0" 禁用/启用 批量删除按钮 -->
            <el-button type="danger" 
                       size="small" 
                       style="margin-top: 8px" 
                       :disabled="multipleSelection.length==0"
                       @click="deleteMany">批量删除
            </el-button>
        </div>
       <!-- Dialog对话框 效果  dialogVisible bool类型-->
        <el-dialog
                title="编辑职位"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <el-tag>职位名称</el-tag>
                 <el-input v-model="updatePos.name" size="small" class="updatePosInput"></el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data() {
            return {
                //添加时候的
                pos: {
                    name: ''
               },
                dialogVisible: false, //messagebox弹框是否跳出
                //编辑更新用的
                updatePos: {
                    name: ''
               },
                multipleSelection: [],
                positions: []
           }
       },
        mounted() {
            //调用初始化职位的方法 登录有登录按钮， 这里一道数据管理就显示所有数据 vue实例 生命周期图示，一般情况下，在页面初始化就要加载的数据放在mounted里面的
            this.initPositions();  
       },
        methods: {
             deleteMany() {
                 //messagebox弹框 
                this.$confirm('此操作将永久删除【' + this.multipleSelection.length+ '】条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
               }).then(() => {
                    //？传参
                    let ids = '?';
                    this.multipleSelection.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                   })
                    this.deleteRequest('/system/basic/pos/' + ids).then(resp =>{
                        if (resp) {
                            this.initPositions();
                       }
                   });
               }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                   });
               });
           },
            //val是勾选的那些对象 放到multipleSelection 
            handleSelectionChange(val) {
                this.multipleSelection = val;
           },
            addPosition() {
                if (this.pos.name) {
                    this.postRequest('/system/basic/pos/', this.pos).then(resp=> {
                        if (resp) {
                            //添加后刷新展示
                            this.initPositions();
                            //添加以后输入框刚才的信息还在 设为空
                            this.pos.name = '';
                       }
                   })
               } else {
                    //message消息提示
                    this.$message.error('职位名称不可以为空！');
               }
           },
            //Dialog对话框 
            showEditView(index, data) {
                //this.updatePos=data 直接赋值 数据会同步变化 所以用数据的拷贝
                Object.assign(this.updatePos,data);
                //后端不接受这个修改的值，设置空，后端处理
                this.updatePos.createDate = '';
                this.dialogVisible = true;
           },
            // this.updatePos  更新需要传id name ，但是因为在这 Object.assign(this.updatePos,data); data包含整个查询到的数据包括id...,所以不需要传id,name也会传进来
            doUpdate() {
                this.putRequest('/system/basic/pos/', this.updatePos).then(resp=> {
                    if (resp) {
                        this.initPositions();
                        this.updatePos.name = '';
                        this.dialogVisible = false;
                    }
              })
           },
            handleDelete(index, data) {
                //messagebox弹框  调用$confirm方法即可打开消息提示，它模拟了系统的 confirm。Message Box 组件也拥有极高的定制性，我们可以传入options作为第三个参数，它是一个字面量对象。type字段表明消息类型，可以为success，error，info和warning，无效的设置将会被忽略。注意，第二个参数title必须定义为String类型，如果是Object，会被理解为options。在这里我们用了 Promise 来处理后续响应。
                this.$confirm('此操作将永久删除该【' + data.name + '】职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
               }).then(() => {
                    this.deleteRequest('/system/basic/pos/' + data.id).then(resp=> {
                        if (resp) {
                            this.initPositions();
                       }
                   });
               }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                   });
               });
           },
           //返回结果是一个数组包含一个一个json对象 positions和表格绑定，把对应数据放在positions里面，自动会和表格绑定，展示
            initPositions() {
                this.getRequest('/system/basic/pos/').then(resp => {
                    if (resp) {
                        this.positions = resp;
                   }
               })
           }
       }
   }
</script>

<style>
.addPosInput{
   width: 300px;
   margin-right: 8px;
}
.posManaMain{
   margin-top: 20px;
}
.updatePosInput{
   width: 200px;
   margin-left: 8px;
}
</style>
   