<template>
  <div>
      <div style="display:flex; justify-content:center; margin-top=8px">
          <el-input v-model="keywords"   
                    placeholder="通过用户名搜索用户..." 
                    prefix-icon="el-icon-search" 
                    style="width:400px;margin-right:10px;">
          </el-input>
          <el-button type="primary" 
                     icon="el-icon-search" 
                     @click="doSearch">搜索</el-button>
      </div>
      <div class="admin-container">
          <el-card class="admin-card" v-for="(admin,index) in admins" :key="index">
              <div slot="header" class="clearfix">
                  <span>{{admin.name}}</span>
                  <el-button style="float: right; padding: 3px 0; color:red" 
                            type="text" 
                            icon="el-icon-delete"
                             @click="deleteAdmin(admin)">
                  </el-button>
               </div>
               <div>
                  <div class="img-container">
                      <img :src="admin.userFace" :alt="admin.name" :title="admin.name" class="userface-img">
                   </div>
               </div>

               <div class=" userinfo-container">
                 <div>用户名：{{admin.name}}</div>
                 <div>手机号码：{{admin.phone}}</div>
                 <div>电话号码：{{admin.telep}}</div>
                 <div>地址：{{admin.address}}</div>
                 <div>用户状态：
                   <el-switch
                      style="display: block"
                      v-model="admin.enabled"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="enabledChange(admin)"
                      active-text="启用"
                      inactive-text="禁用">
                  </el-switch>
                 </div>
               </div>
               <div>
                 用户角色：
                 <el-tag  style="margin-right:4px" 
                          type="success " 
                          v-for="(role,indexj) 
                          in admin.roles" 
                        :key="indexj">{{role.nameZh}}
                 </el-tag>
                 <!--   poverty弹出框 click激活-->
                  <el-popover   placement="right"
                                title="角色列表"
                                width="200"
                                @show="showPop(admin)"
                                @hide="hidePop(admin)">
                        <!--select选择器  selectedRoles拿到的是id 为el-select设置multiple属性即可启用多选，此时v-model的值为当前选中值所组成的数组。默认情况下选中值会以 Tag 的形式展现，你也可以设置collapse-tags属性将它们合并为一段文字。 -->   
                      <el-select v-model="selectedRoles" multiple placeholder="请选择">
                         <el-option
                           v-for="(r,indexk) in allRoles"
                           :key="indexk"
                           :label="r.nameZh"
                           :value="r.id">
                         </el-option>
                        </el-select>
                      <el-button  slot="reference" type="text" icon="el-icon-more"></el-button>
                  </el-popover>
                 
               </div>
               <div>
                 备注：
                 {{admin.remark}}

               </div>
          </el-card>
      </div>

     
  </div>
</template>

<script>
export default {
    name:"SysAdmin",
    data(){
      return{
        admins:[],
        keywords:'',
        allRoles:[],
        selectedRoles:[]
      }
    },
    mounted(){
      this.initAdmins();
      
    },
    methods:{
      hidePop(admin){
        let roles=[];  //里面是一个个角色对象
        Object.assign(roles,admin.roles);
          let flag=false;
          if(roles.length==this.selectedRoles.length){  //selectedRoles.length选中个数  admin.roles不变
              flag=true;
          }else{
            for(let i=0; i<roles.length; i++){
              let role=roles[i];
              for(let j=0; j<this.selectedRoles.length; j++){
                  let sr=this.selectedRoles[j];
                  if(role.id==sr){
                    roles.splice(i,1);
                    i--;
                    break;
                  }
              }
            }
            if(roles.length!=0){
              flag=true;
            }          
          }

         if(flag){
             let url=' /system/admin/role?adminId='+admin.id;
             this.selectedRoles.forEach(sr=>{   //sr =select role选择的
                url+='&rids='+sr;
             });
             this.putRequest(url).then(resp=>{
              if(resp){
                this.initAdmins();
             }
          })
         }
      },
      showPop(admin){
        this.initAllRoles();
        let roles=admin.roles; //对象
        this.selectedRoles=[]; //初始化
        roles.forEach(r => {
          this.selectedRoles.push(r.id);
          
        });
      },
      initAllRoles(){
          this.getRequest('/system/admin/roles').then(resp=>{
            if(resp){
              this.allRoles=resp;
            }
          })
      },
      enabledChange(admin){
        this.putRequest('/system/admin/',admin).then(resp=>{
          this.initAdmins();
        })
      },
      deleteAdmin(admin){
         this.$confirm('此操作将永久删除该【'+admin.name+'】操作员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.deleteRequest('/system/admin/'+admin.id).then(resp=>{
           if(resp){
             this.initAdmins();
           }
         })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
      doSearch(){
        this.initAdmins();
      },
      initAdmins(){
        this.getRequest('/system/admin/?keywords='+this.keywords).then(resp=>{
          if(resp){
            this.admins=resp;
          }
        })
      }
    }
}
</script>
<style >
    .admin-container{
      display: flex;
      margin-top:10px ;
      justify-content: space-around;
      flex-wrap: wrap;
    }

    .admin-card{
      width: 350px;
      margin-bottom: 20px;
    
    }

    .userface-img{
      width: 72px;
      height: 72px;
      border-radius: 72px ;
    }
    .img-container{
      width: 100%;
      display: flex;
      justify-content: center;
    }

    .userinfo-container{
      font-size: 12px;
      color: cornflowerblue;
    }
   

</style>