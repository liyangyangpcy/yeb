<!--员工账套-->
<template>
  <div>
      <div>
        <el-table
                :data="emps"
                size="mini"
                border
                stripe
                height="400">
            <el-table-column
                    type="selection"
                    align="left"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    align="left"
                    fixed
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="workID"
                    label="工号"
                    align="left"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱地址"
                    align="left"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="电话号码"
                    align="left"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="department.name"
                    label="所属部门"
                    align="left"
                    width="105">
            </el-table-column>
            <el-table-column
                    label="工资账套"
                    align="center">
                <template slot-scope="scope">
                     <!--Tooltip 文字提示常用于展示鼠标 hover 时的提示信息。-->
                    <el-tooltip placement="right" v-if="scope.row.salary">
                        <div slot="content">
                            <table>
                              <tr>
                                  <td>基本工资</td>
                                  <td>{{scope.row.salary.basicSalary}}</td>
                              </tr>
                              <tr>
                                  <td>交通补助</td>
                                  <td>{{scope.row.salary.trafficSalary}}</td>
                              </tr>
                              <tr>
                                  <td>午餐补助</td>
                                  <td>{{scope.row.salary.lunchSalary}}</td>
                              </tr>
                              <tr>
                                  <td>奖金</td>
                                  <td>{{scope.row.salary.bonus}}</td>
                              </tr>
                              <tr>
                                  <td>养老金比率</td>
                                  <td>{{scope.row.salary.pensionPer}}</td>
                              </tr>
                              <tr>
                                  <td>养老金基数</td>
                                  <td>{{scope.row.salary.pensionBase}}</td>
                              </tr>
                              <tr>
                                  <td>医疗保险比率</td>
                                  <td>{{scope.row.salary.medicalPer}}</td>
                              </tr>
                              <tr>
                                  <td>医疗保险基数</td>
                                  <td>{{scope.row.salary.medicalBase}}</td>
                              </tr>
                              <tr>
                                  <td>公积金比率</td>
                                  <td>{{scope.row.salary.accumulationFundPer}}</td>
                              </tr>
                              <tr>
                                  <td>公积金基数</td>
                                  <td>{{scope.row.salary.accumulationFundBase}}</td>
                              </tr>
                            </table>
                        </div>
                        <!--scope.row员工对象-->
                        <el-tag >{{scope.row.salary.name}}</el-tag> 
                    </el-tooltip>                   
                    <el-tag v-else >暂未设置</el-tag>
                </template>
            </el-table-column>

            <el-table-column
                    label="操作"
                    align="center">
                    <template slot-scope="scope">
                          <!--Popover 弹出框show	显示时触发-->
                          <el-popover
                               placement="left"
                               title="编辑工资账套"
                               @show="showPop(scope.row.salary)"
                               @hide="hidePop(scope.row)"
                               width="200"
                               trigger="click">
                               <div>
                                     <el-select v-model="currentSalary" placeholder="请选择">
                                     <el-option
                                       v-for="item in salaries"
                                       :key="item.id"
                                       :label="item.name"
                                       :value="item.id">
                                     </el-option>
                               </el-select>
                               </div>
                              <el-button slot="reference" type="danger" size="mini">修改工资账套</el-button>
                          </el-popover>
                         
                    </template>
           </el-table-column>
        </el-table>

        <div style="display: flex; justify-content: flex-end; margin-top:5px">
            <!--Pagination 分页layout	组件布局，子组件名用逗号分隔
            size-change	pageSize 改变时会触发	每页条数
            current-change	currentPage 改变时会触发	当前页-->
            <el-pagination
                background
                @current-change="currentChange"
                @size-change="sizeChange"
                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                :total="total">
            </el-pagination>
        </div>
      </div>
  </div>
</template>

<script>
export default {
    name:"SalSobCfg",
    data(){
      return{
        emps:[],
        salaries:[],
        currentSalary:null,
        currentPage:1,
        size:10,
        total:0
      }
    },

    mounted(){
      this.initEmps();
      this.initSalaries();
    },

    methods:{
      hidePop(data){
        if(this.currentSalary && this.currentSalary!=data.salary.id){  //和员工本身id要不一样
            this.putRequest('/salary/sobcfg/?eid='+data.id+'&sid='+this.currentSalary).then(resp=>{
             if(resp){
               this.initEmps();
             }
            })
        }  
      },
      showPop(data){
          if(data){
            this.currentSalary=data.id;  //data当前员工的salary
          }else{
            this.currentSalary=null;
          }
      },

      initSalaries(){
          this.getRequest('/salary/sobcfg/salaries').then(resp=>{
            if(resp){
              this.salaries=resp;
            }
          })
      },

      currentChange(page){
          this.currentPage=page;
          this.initEmps();
      },

      sizeChange(size){
        this.size=size;
        this.initEmps();

      },

      initEmps(){
        this.getRequest('/salary/sobcfg/?currentPage='+this.currentPage+'&size='+this.size).then(resp=>{
            if(resp){
              this.emps = resp.data;  //有分页而且获取到的除了data数组，还有total
              this.total= resp.total;
            }
        })

      }
    }
};
</script>
<style scoped>

</style>