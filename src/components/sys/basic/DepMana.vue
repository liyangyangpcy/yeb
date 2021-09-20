<template>
  <div style="width:600px">
    <!--Tree树形控件 节点过滤通过关键字过滤树节点 
     expand-on-click-node	是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。-->
    <el-input
      placeholder="请输入部门名称进行搜索..."
      prefix-icon="el-icon-search"
      v-model="filterText"
    >
    </el-input>
    <el-tree
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <!--slot-scope自定义树节点里面的内容使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据（后端返回的数据）。-->
      <span
        class="custom-tree-node"
        slot-scope="{ node, data }"
        style="display:flex;justify-content: space-between;width:100%;"
      >
        <!--{{ node.label }}节点展示的列名-->
        <span>{{ data.name }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            class="depBtn"
            @click="() => showAddDep(data)">
            添加部门
          </el-button>
          <el-button
            type="danger"
            size="mini"
            class="depBtn"
            @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="30%">
     <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>{{pname}}</td>
          </tr>
          <tr>
            <td>
              <el-tag>部门名称</el-tag>
            </td>
            <td>
              <el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input>
            </td>
          </tr>
        </table>
     </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click=" doAddDep">确 定</el-button >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DepMana',
  data() {
    return {
      filterText: '',
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      dialogVisible: false,
      dep:{
        name:'',
        parentId:-1,
      },
      pname:'',
    }
  },

  watch: {
    //观察者事件
    filterText(val) {
      this.$refs.tree.filter(val) //filter调用filterNode拦截节点的方法 val就是传过去的值value
    },
  },
  mounted() {
    this.initDeps()
  },

  methods: {
    initDep(){
      this.dep={
        name:'',
        parentId:-1
      }
      this.pname='';
    },

    addDep2Deps(deps,dep){  //deps查询的一整个数组，dep插入/添加的部门到d,d 父部门
      for(let i=0; i<deps.length; i++){
        let d=deps[i];          
        if(d.id == dep.parentId){
          d.children=d.children.concat(dep);
          if(d.children.length>0){
            d.isParent=true;
          }
          return;
        }else{
          this.addDep2Deps(d.children, dep);
        }
      }
      
    },
    
    doAddDep(){
      this.postRequest('/system/basic/department/',this.dep).then(resp=>{
        if(resp){
          this.addDep2Deps(this.deps,resp.obj);
          this.dialogVisible=false;
          this.initDep();
          

        }
      })
    },

    showAddDep(data) {
      this.dep.parentId=data.id;
      this.pname=data.name;
      this.dialogVisible=true;   
    },


    removeDepFromDeps(p,deps,id){  
      for(let i=0; i<deps.length; i++){  
        let d=deps[i];
        if(d.id==id){
          deps.splice(i,1);  //从当前索引开始删除， 删1个
          if(deps.length==0){  //d.children没有值
            p.isParent=false;
          }
          return;
        }else{
          this.removeDepFromDeps(d,d.children,id); //d本身就是一个父对象 递归
        }
      }
    },

    deleteDep(data) {
       if(data.isParent){
         this.$message.error('父部门删除失败');

       }else{
          this.$confirm('此操作将永久删除该['+data.name+']部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/department/'+data.id).then(resp=>{
            if(resp){
              this.removeDepFromDeps(null,this.deps,data.id);   //董事会是最大上面没有父部门，传null,递归会找的
            
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
       }
    },

    initDeps() {
      this.getRequest('/system/basic/department/').then((resp) => {
        if (resp) {
          this.deps = resp;        //询完查 isparent=1 true  删除的时候直接操作树形控件而没有去查询对应的数据，数据没有变更，后端数据已经变更，但是这边没有请求并没有重新获取数据，isparent还是true,所以没有子部门，还是父部门删除失败
        }
      })
    },

    filterNode(value, data) {
      //data是这一行的数据，在那个目录就是目录的整行
      if (!value) return true //true  节点/整个树形控件可以进行全部展示
      return data.name.indexOf(value) !== -1
    },
  },
}
</script>

<style>
.depBtn {
  padding: 2px;
}
</style>
