<!--员工资料 基本信息-->
<template>
  <div>
    <div style="display:flex; justify-content:space-between">
      <div>
        <!--使用clearable属性即可得到一个可清空的输入框,  在点击由 clearable 属性生成的清空按钮时触发-->
        <el-input   v-model="empName"
                    @keydown.enter.native="initEmps"
                    clearable
                    @clear="initEmps"
                    placeholder="请输入员工名进行搜索..."
                    prefix-icon="el-icon-search"
                    style="width:300px;margin-right:10px" 
                    :disabled="showAdvanceSearchVisible">
        </el-input>
        <el-button type="primary" 
                  icon="el-icon-search" 
                  @click="initEmps"  
                  :disabled="showAdvanceSearchVisible">
        搜索
        </el-button>
        
        <el-button type="primary" @click="showAdvanceSearchVisible=!showAdvanceSearchVisible">
          <!--fontasome组件  三木运算-->
          <i :class="showAdvanceSearchVisible?'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>
          高级搜索
        </el-button>
      </div>
      <div>
        <!--Upload 上传通过点击或者拖拽上传文件 multiple多选 show-file-list	是否显示已上传文件列表
        before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
        on-success	文件上传成功时的钩子
        headers	设置上传的请求头部
        两种：1、传统的ajax可以匹配大部分的情况 2、用了ELEMENTUI，用它自带的组件，对这个组件做了定制化规则 -->
        <el-upload   action="/employee/basic/import"
                     style="display:inline-flex; margin-right:8px"
                     :headers="headers"
                     :show-file-list="false"
                     :before-upload	="beforeUpload"
                     :on-success="onSuccess"
                     :on-error="onError"
                     :disabled="importDataDisabled"
                     >
                    <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">                   
                       {{ importDataBtnText}}
                    </el-button>
        </el-upload>
        <!--使用第三方插件 封装：主要因为authorization，包括elementui上传组件也要带请求头，后端有jwt令牌，会做jwt令牌的拦截-->
        <el-button @click="exportData" type="success" icon="el-icon-download">        
          导出数据
        </el-button>

        <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">
          添加员工
        </el-button>
      </div>
    </div>
<!--transition-->
    <transition name="slide-fade">
    <!--box-sizing: border-box;内容撑开-->
    <div v-show="showAdvanceSearchVisible" style="border:1px solid #409eff; border-radius:5px; box-sizing: border-box; padding: 5px; margin:10px 0px">
        <!--Layout布局-->
        <el-row>
            <el-col :span="5">
              政治面貌：
              <el-select
                  v-model="searchValue.politicId"
                  placeholder="政治面貌"
                  style="width:100px"
                  size="mini"
                >
                  <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
           </el-col>

           <el-col :span="4">
             民族：
             <el-select
                  v-model="searchValue.nationId"
                  placeholder="民族"
                  style="width:100px"
                  size="mini"
                >
                  <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
           </el-col>

            <el-col :span="4">
              职位：
              <el-select
                  v-model="searchValue.posId"
                  placeholder="职位"
                  style="width:100px"
                  size="mini"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
              职称：
              <el-select
                  v-model="searchValue.jobLevelId"
                  placeholder="职称"
                  style="width:100px"
                  size="mini"
                >
                  <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
            </el-col>
            <el-col :span="7">
              聘用形式：
              <el-radio-group v-model="searchValue.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
              </el-radio-group>
           </el-col>
        </el-row>
       
        <el-row style="margin-top:10px">
            <el-col :span="5">
              所属部门：
              <el-popover
                  placement="bottom"
                  title="请选择部门"
                  width="200"
                  trigger="manual"
                  v-model="visible2"
                >
                  <!--Tree 树形控件-->
                  <el-tree
                    :data="allDeps"
                    :props="defaultProps"
                    default-expand-all
                    @node-click="searchHandleNodeClick"
                  ></el-tree>
                  <div
                    slot="reference"
                    style="width:100px; margin-top:8px; align-items:center; font-size:13px; padding-left:8px; display:inline-flex; border:1px solid #dedede; height:24px; border-radius:5px ; cursor:pointer; box-sizing:border-box; "
                    @click="showDepView2">
                      {{inputDepName}}
                  </div>
                </el-popover>
            </el-col>

            <el-col :span="12">
              入职日期：
              <!--DatePicker 日期选择器用于选择或输入日期 在选择日期范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前月份，可以使用unlink-panels属性解除联动。-->
               <el-date-picker
                   v-model="searchValue.beginDateScope"
                   type="daterange"
                   value-format="yyyy-MM-dd"
                    unlink-panels
                   range-separator="至"
                   start-placeholder="开始日期"
                   end-placeholder="结束日期"                
                   size="mini">
               </el-date-picker>
            </el-col>
            <!--offset偏移量-->
            <el-col :span="5" :offset="2">
              <el-button size="mini">取消</el-button>
              <el-button size="mini" type="primary" icon="el-icon-search" @click="initEmps('advanced')">搜索</el-button>
            </el-col>
        </el-row>
    </div>
    </transition>



    <div style="margin-top:10px">
      <el-table
        :data="emps"
        size="mini"
        style="width: 100% "
        height="350"
        stripe
        border
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="姓名" fixed align="left" width="90">
        </el-table-column>
        <el-table-column prop="workID" label="工号" width="90">
        </el-table-column>
        <el-table-column prop="gender" label="性别" width="50">
        </el-table-column>
        <el-table-column prop="birthday" label="出生日期" width="110">
        </el-table-column>
        <el-table-column
          prop="idCard"
          label="身份证号"
          align="left"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="wedlock" label="婚姻状况" width="80">
        </el-table-column>
        <el-table-column prop="nation.name" label="民族" width="50">
        </el-table-column>
        <el-table-column prop="nativePlace" label="籍贯" width="80">
        </el-table-column>
        <el-table-column
          prop="politicsStatus.name"
          label="政治面貌"
          width="130"
        >
        </el-table-column>
        <el-table-column prop="email" label="电子邮件" align="left" width="190">
        </el-table-column>
        <el-table-column prop="phone" label="电话号码" align="left" width="130">
        </el-table-column>
        <el-table-column
          prop="address"
          label="联系地址"
          align="left"
          width="300"
        >
        </el-table-column>
        <el-table-column prop="department.name" label="所属部门" width="80">
        </el-table-column>
        <el-table-column prop="joblevel.name" label="职称" width="100">
        </el-table-column>
        <el-table-column prop="position.name" label="职位" width="100">
        </el-table-column>
        <el-table-column
          prop="engageForm"
          align="left"
          label="聘用形式"
          width="100"
        >
        </el-table-column>
        <el-table-column prop="tiptopDegree" label="最高学历" width="80">
        </el-table-column>
        <el-table-column
          prop="school"
          label="毕业院校"
          align="left"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="specialty" label="专业" align="left" width="150">
        </el-table-column>
        <el-table-column
          prop="workState"
          label="在职状态"
          align="left"
          width="80">
        </el-table-column>
        <el-table-column
          prop="beginDate"
          label="入职日期"
          align="left"
          width="100">
        </el-table-column>
        <el-table-column
          prop="conversionTime"
          label="转正日期"
          align="left"
          width="100">
        </el-table-column>
        <el-table-column
          prop="beginContract"
          label="合同起始日期"
          align="left"
          width="120">
        </el-table-column>
        <el-table-column
          prop="endContract"
          label="合同截至日期"
          align="left"
          width="120">
        </el-table-column>
        <el-table-column label="合同期限" align="left" width="90">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>年
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <!--有scope， 可以拿去整个一条json数据对象-->
          <template slot-scope="scope">
            <el-button @click="showEditEmpView(scope.row)" style="padding:3px" size="mini">编辑</el-button>
            <el-button style="padding:3px" size="mini" type="primary">查看高级资料</el-button>
            <el-button @click="deleteEmp(scope.row)"  style="padding:3px" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--Pagination 分页当数据量过多时，使用分页分解数据。layout	组件布局，子组件名用逗号分隔
          size-change	pageSize 改变时会触发
          current-change	currentPage 改变时会触发 -->
      <div style="display:flex;justify-content:flex-end">
        <el-pagination
          @current-change="currenyChange"
          @size-change="sizeChange"
          background
          layout="sizes,prev, pager, next, jumper, ->, total"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <!--dialog弹出框-->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="80%">
      <div>
        <!--表单提交 因为属性多 可以校验-->
        <el-form ref="empForm" :model="emp"  :rules="rules">
          <!--Layout布局Row 组件 提供 gutter 属性来指定每一栏之间的间隔，默认间隔为 0。一列四行-->
          <el-row>
            <el-col :span="6">
              <!--el-form-item表单的元素   prop="name"后面做校验规则的传参-->
              <el-form-item label="姓名:" prop="name">
                <el-input
                  size="mini"
                  style=" width:150px"
                  prefix-icon="el-icon-edit"
                  v-model="emp.name"
                  placeholder="请输入员工姓名..."
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <!--Radio 单选框在一组备选项中进行单选-->
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期：" prop="birthday">
                <!--日期选择器-->
                <el-date-picker
                  v-model="emp.birthday"
                  type="date"
                  size="mini"
                  style="width:130px"
                  value-format="yyyy-MM-dd"
                  placeholder="出生日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌：" prop="politicId">
                <!--select选择器 下拉选择框-->
                <el-select
                  v-model="emp.politicId"
                  placeholder="政治面貌"
                  style="width:180px"
                  size="mini"
                >
                  <el-option
                    v-for="item in politicsstatus"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="民族:" prop="nationId">
                <!--select选择器 下拉选择框-->
                <el-select
                  v-model="emp.nationId"
                  placeholder="民族"
                  style="width:150px"
                  size="mini"
                >
                  <el-option
                    v-for="item in nations"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input
                  size="mini"
                  style=" width:120px"
                  prefix-icon="el-icon-edit"
                  v-model="emp.nativePlace"
                  placeholder="请输入籍贯..."
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱：" prop="email">
                <el-input
                  v-model="emp.email"
                  size="mini"
                  prefix-icon="el-icon-message"
                  style="width:130px"
                  placeholder="请输入电子邮箱..."
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址：" prop="address">
                <el-input
                  v-model="emp.address"
                  placeholder="请输入地址..."
                  style="width:180px"
                  size="mini"
                  prefix-icon="el-icon-edit"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="posId">
                <!--select选择器 下拉选择框-->
                <el-select
                  v-model="emp.posId"
                  placeholder="职位"
                  style="width:150px"
                  size="mini"
                >
                  <el-option
                    v-for="item in positions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select
                  v-model="emp.jobLevelId"
                  placeholder="职称"
                  style="width:120px"
                  size="mini"
                >
                  <el-option
                    v-for="item in joblevels"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门：" prop="departmentId" >
                <!--Popover 弹出框 trigger属性用于设置何时触发 Popover 有两种写法：使用 slot="reference" 的具名插槽，或使用自定义指令v-popover指向 Popover 的索引ref-->
                <el-popover
                  placement="bottom"
                  title="请选择部门"   
                  width="200"
                  trigger="manual"
                  v-model="visible"
                >
                  <!--Tree 树形控件-->
                  <el-tree
                    :data="allDeps"
                    :props="defaultProps"
                    default-expand-all
                    @node-click="handleNodeClick"
                  ></el-tree>
                  <div
                    slot="reference"                 
                    style="width:130px; margin-top:8px; align-items:center; font-size:13px; padding-left:8px; display:inline-flex; border:1px solid #dedede; height:24px; border-radius:5px ; cursor:pointer; box-sizing:border-box; "
                    @click="showDepView"
                    >
                      {{inputDepName}}
                  </div>
                </el-popover>
                <!--slot="reference"能触发点选事件-->
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="电话号码：" prop="phone">
                <el-input
                  v-model="emp.phone"
                  placeholder="请输入电话号码..."
                  style="width:180px"
                  size="mini"
                  prefix-icon="el-icon-phone"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workID">
                <el-input
                  v-model="emp.workID"
                  placeholder="请输入工号..."
                  style="width:150px"
                  size="mini"
                  prefix-icon="el-icon-edit"
                  disabled
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select
                  v-model="emp.tiptopDegree"
                  placeholder="学历"
                  style="width:120px"
                  size="mini"
                >
                  <!--写定的学历，不去后端查，传值item， 后端接收也是item-->
                  <el-option
                    v-for="item in tiptopDegrees"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校：" prop="school">
                <el-input
                  v-model="emp.school"
                  placeholder="请输入学校..."
                  style="width:150px"
                  size="mini"
                  prefix-icon="el-icon-edit"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称：" prop="specialty">
                <el-input
                  v-model="emp.specialty"
                  placeholder="请输入专业名称..."
                  style="width:180px"
                  size="mini"
                  prefix-icon="el-icon-edit"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <!--日期选择器-->
                <el-date-picker
                  v-model="emp.beginDate"
                  type="date"
                  size="mini"
                  style="width:125px"
                  value-format="yyyy-MM-dd"
                  placeholder="入职日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期:" prop="conversionTime">
                <!--日期选择器-->
                <el-date-picker
                  v-model="emp.conversionTime"
                  type="date"
                  size="mini"
                  style="width:120px"
                  value-format="yyyy-MM-dd"
                  placeholder="转正日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <!--日期选择器-->
                <el-date-picker
                  v-model="emp.beginContract"
                  type="date"
                  size="mini"
                  style="width:120px"
                  value-format="yyyy-MM-dd"
                  placeholder="合同起始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期:" prop="endContract">
                <!--7 分栏   日期选择器-->
                <el-date-picker
                  v-model="emp.endContract"
                  type="date"
                  size="mini"
                  style="width:160px"
                  value-format="yyyy-MM-dd"
                  placeholder="合同截止日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码：" prop="idCard">
                <el-input
                  v-model="emp.idCard"
                  size="mini"
                  style="width:180px"
                  placeholder="请输入身份证号码"
                  prefix-icon="el-icon-edit"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式：" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况：" prop="wedlock">
                <el-radio-group v-model="emp.wedlock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddEmp"  >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EmpBasic',
  data() {
    return {
      searchValue:{
        nationId: null,
        politicId: null,
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        beginDateScope:null,
      },
      showAdvanceSearchVisible:false,
      headers:{
          Authorization: window.sessionStorage.getItem('tokenStr')      
      },
      importDataDisabled:false,
      importDataBtnText:'导入数据',
      importDataBtnIcon:'el-icon-upload2',
      title:'',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      inputDepName:'',   //所属部门
      allDeps: [],
      visible: false,
      visible2: false,
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      tiptopDegrees: [
        '博士',
        '硕士 ',
        '本科',
        '大专',
        '高中',
        '初中',
        '小学',
        '其他 ',
      ],

      emp: {
        id:null,
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlacenull: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workID: '',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: null,
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null,
      },

      rules:{  //属性名，触发条件，提示信息，以及是否触发相应的规则  trigger: "blur"失去焦点时触发required: true 必填
          name: [{required: true, message: "请输入员工姓名", trigger: "blur"}],
          gender: [{required: true, message: "请输入员工性别", trigger: "blur"}],
          birthday: [{required: true, message: "请输入出生日期", trigger: "blur"}],
          idCard: [{required: true, message: "请输入身份证号", trigger: "blur"}, {
            pattern:/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, 
            message: "身份证号不正确",
            trigger: "blur"
          }],  //pattern:,身份证号码的正则表达式
          wedlock: [{required: true, message: "请输入婚姻状况", trigger: "blur"}],
          nationId: [{required: true, message: "请输入民族", trigger: "blur"}],
          nativePlace: [{required: true, message: "请输入籍贯", trigger: "blur"}],
          politicId: [{required: true, message: "请输入政治面貌", trigger: "blur"}],
          email: [{required: true, message: "请输入邮箱地址", trigger: "blur"}, {
            type:'email', 
            message: "邮箱地址格式不正确", 
            trigger: "blur"
          }], //type:'email' elementui自带的校验规则
          phone: [{required: true, message: "请输入电话号码", trigger: "blur"}],
          address: [{required: true, message: "请输入员工地址", trigger: "blur"}],
          departmentId: [{required: true, message: "请输入部门名称", trigger: "blur"}],
          jobLevelId: [{required: true, message: "请输入职称", trigger: "blur"}],
          posId: [{required: true, message: "请输入职位", trigger: "blur"}],
          engageForm: [{required: true, message: "请输入聘用形式", trigger: "blur"}],
          tiptopDegree: [{required: true, message: "请输入学历", trigger: "blur"}],
          specialty: [{required: true, message: "请输入专业", trigger: "blur"}],
          school: [{required: true, message: "请输入毕业院校", trigger: "blur"}],
          beginDate: [{required: true, message: "请输入入职日期", trigger: "blur"}],
          workState: [{required: true, message: "请输入工作状态", trigger: "blur"}],
          workID: [{required: true, message: "请输入工号", trigger: "blur"}],
          contractTerm: [{required: true, message: "请输入合同期限", trigger: "blur"}],
          conversionTime: [{required: true, message: "请输入转正日期", trigger: "blur"}],
          beginContract: [{required: true, message: "请输入合同起始日期", trigger: "blur"}],
          notWorkDate: [{required: true, message: "请输入离职日期", trigger: "blur"}],
          endContract: [{required: true, message: "请输入合同结束日期", trigger: "blur"}],
          workAge: [{required: true, message: "请输入工龄", trigger: "blur"}],
      },

    }
  },

  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },

  methods: {
    showDepView2(){
        this.visible2=!this.visible2;
    },
    searchHandleNodeClick(data){
        this.inputDepName=data.name;
        this.searchValue.departmentId=data.id;
        this.visible2=!this.visible2;
    },
  
   
    onSuccess(){
        this.importDataBtnIcon='el-icon-upload2';
        this.importDataBtnText='导入数据';
        this.importDataDisabled=false;
        this.initEmps();
    },

   onError(){
        this.importDataBtnIcon='el-icon-upload2';
        this.importDataBtnText='导入数据';
        this.importDataDisabled=false;
    },

    beforeUpload(){
        this.importDataBtnIcon='el-icon-loading';
        this.importDataBtnText='正在导入';
        this.importDataDisabled=true;

    },

    exportData(){
      this.downloadRequest('/employee/basic/export');
    },

    showEditEmpView(data){
        this.title='编辑员工信息';
        this.emp=data;
        this.inputDepName=data.department.name;
        this.initPositions();
        this.dialogVisible=true;
       
    },

    deleteEmp(data){
        this.$confirm('此操作将永久删除员工'+data.name+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest(' /employee/basic/'+data.id).then(resp=>{
            if(resp){
                this.initEmps();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },

    doAddEmp(){
      if(this.emp.id){
          this.$refs['empForm'].validate(valid=>{
              if(valid){  //验证通过
                 this.putRequest('/employee/basic/',this.emp).then(resp=>{
                   if(resp){
                      this.dialogVisible=false;
                       this.initEmps();    //表单输入框很多，要做数据校验
                    }
                })
              }
         })
      }else{
          this.$refs['empForm'].validate(valid=>{
              if(valid){  //验证通过
                 this.postRequest('/employee/basic/',this.emp).then(resp=>{
                   if(resp){
                      this.dialogVisible=false;
                       this.initEmps();    //表单输入框很多，要做数据校验
                    }
                })
              }
         })
      }     
    },

    handleNodeClick(data){  //一个节点就是一个完整的json数据对象
      this.inputDepName=data.name;
      this.emp.departmentId=data.id;
      this.visible=!this.visible;
    },

    showDepView() {
      this.visible = !this.visible
    },

    getMaxWorkID() {
      //展示对话框调用
      this.getRequest('/employee/basic/maxWorkID').then((resp) => {
        if (resp) {
          this.emp.workID = resp.obj
        }
      })
    },

    initPositions() {
      //职位会变动，不放sessionstorage里  ，打开对话框时调用（弹框）
      this.getRequest('/employee/basic/positions').then((resp) => {
        if (resp) {
          this.positions = resp;
        }
      })
    },

    showAddEmpView() {
      this.title='添加员工';
      this.emp= {
        id:null,
        name: '',
        gender: '',
        birthday: '',
        idCard: '',
        wedlock: '',
        nationId: null,
        nativePlacenull: '',
        politicId: null,
        email: '',
        phone: '',
        address: '',
        departmentId: null,
        jobLevelId: null,
        posId: null,
        engageForm: '',
        tiptopDegree: '',
        specialty: '',
        school: '',
        beginDate: '',
        workState: '在职',
        workID: '',
        contractTerm: null,
        conversionTime: '',
        notWorkDate: null,
        beginContract: '',
        endContract: '',
        workAge: null,
        salaryId: null,
      };
      this.inputDepName='';
      this.getMaxWorkID();
      this.initPositions();
      this.dialogVisible = true;
    },

    initData() {
      if (!window.sessionStorage.getItem('nations')) {
        //不存在去获取
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem('nations', JSON.stringify(resp));  //存入sessionstorage,对象转成json字符串
          }
        })
      } else {
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
      }

      if (!window.sessionStorage.getItem('joblevels')) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem('joblevels', JSON.stringify(resp)) //存入sessionstorage,对象转成json字符串
          }
        })
      } else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'))
      }

      if (!window.sessionStorage.getItem('politicsstatus')) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem('politicsstatus',JSON.stringify(resp) ) //存入sessionstorage,对象转成json字符串
          }
        })
      } else {
        this.politicsstatus = JSON.parse(
          window.sessionStorage.getItem('politicsstatus')
        )
      }
//axios不提供下载的功能，流的形式文件，需要安装插件 npm install js-file-download
      if (!window.sessionStorage.getItem('allDeps')) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem('allDeps', JSON.stringify(resp)) ; //存入sessionstorage,对象转成json字符串
          }
        });
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'))
      }

    },

    sizeChange(size) {
      this.size = size
      this.initEmps()
    },

    currenyChange(currentPage) {
      this.currentPage = currentPage
      this.initEmps()
    },

    initEmps(type) {
      this.loading = true;
      let url='/employee/basic/?currentPage=' +this.currentPage +'&size=' +this.size;
      if(type&& type=='advanced'){
        if(this.searchValue.politicId){
          url+='&politicId='+this.searchValue.politicId;
        }
        if(this.searchValue.nationId){
          url+='&nationId='+this.searchValue.nationId;
        }
        if(this.searchValue.posId){
          url+='&posId='+this.searchValue.posId;
        }
        if(this.searchValue.jobLevelId){
          url+='&jobLevelId='+this.searchValue.jobLevelId;
        }
        if(this.searchValue.engageForm){
          url+='&engageForm='+this.searchValue.engageForm;
        }
        if(this.searchValue.departmentId){
          url+='&departmentId='+this.searchValue.departmentId;
        }
        if(this.searchValue.beginDateScope){
          url+='&beginDateScope='+this.searchValue.beginDateScope;
        }
      }else{
         url+='&name=' +this.empName;

      }

      this.getRequest(url).then((resp) => {
        //不传this.currentPage   this.size 默认第一页 10条
        this.loading = false
        if (resp) {
          this.emps = resp.data
          this.total = resp.total
        }
      })
    },
  },
}
</script>

<style >
 /* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
