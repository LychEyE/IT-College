<template>
  <div style="margin-top: 20px" align="center">
    <div style="width: 50%; height: 600px">
      <el-input
        v-model="filterText"
        placeholder="Filter keyword"
        style="margin-bottom: 30px"
      />
      <el-tree
        ref="tree"
        :data="subject"
        :props="defaultProps"
        :filter-node-method="filterNode"
        class="filter-tree"
        default-expand-all
        draggable
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
          style="font-size: large"
        >
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-if="data.hasOwnProperty('children')"
              type="text"
              @click="() => append(node, data)"
              style="font-size: large"
            >
              新增科目
            </el-button>
            <el-button
              type="text"
              @click="() => edit(node, data)"
              style="font-size: large"
            >
              修改
            </el-button>
            <el-button
              type="text"
              @click="() => remove(node, data)"
              style="font-size: large"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-form :inline="true" label-width="120px">
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="addFirstSubjectForm = true"
          >新增分类</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 新增章节模态框 -->
    <el-dialog title="添加分类" :visible.sync="addFirstSubjectForm">
      <el-form :model="firstSubject">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="firstSubject.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFirstSubjectForm = false">取 消</el-button>
        <el-button type="primary" @click="addFirstSubject">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增科目模态框 -->
    <el-dialog title="添加科目" :visible.sync="addSecondSubjectForm">
      <el-form :model="secondSubject">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="secondSubject.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSecondSubjectForm = false">取 消</el-button>
        <el-button type="primary" @click="addSecondSubject">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改科目模态框 -->
    <el-dialog title="修改科目或名称" :visible.sync="updateSubjectForm">
      <el-form :model="tempSubject">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="tempSubject.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateSubjectForm = false">取 消</el-button>
        <el-button type="primary" @click="updateSubject">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import subject from '@/api/edu/subject'
export default {

  data() {
    return {
      filterText: '',
      subject: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      addFirstSubjectForm: false,
      addSecondSubjectForm:false,
      updateSubjectForm:false,
      firstSubject: {
        title: '',
        children: []
      },
      secondSubject: {
        title: '',
        parentId:'',
      },
      formLabelWidth: '120px',
      tempSubject:{
        title:''
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },

  created() {
    this.getSubjectList()
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    getSubjectList() {
      subject.getSubjectList()
        .then(resp => {
          this.subject = resp.data.subject
        })
    },
    append(node, data) {
      this.addSecondSubjectForm=true
      this.secondSubject.parentId = node.data.id
      console.log(node);
    },
    edit(node, data) {
      this.updateSubjectForm=true
      this.tempSubject.id=data.id
      this.tempSubject.title=data.title
      console.log(data);

    },
    remove(node, data) {
      this.$confirm('此操作将删除该科目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          subject.deleteSubject(data.id).then(res=>{
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getSubjectList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });

    },
    addFirstSubject() {
      subject.addFirstSubject(this.firstSubject).then(res => {
        this.$message({
          type: 'success',
          message: '新增分类成功'
        });
        this.addFirstSubjectForm=false
        this.firstSubject={}
        this.getSubjectList()
      })
    },
    addSecondSubject(){
      subject.addSecondSubject(this.secondSubject).then(res=>{
        this.$message({
          type: 'success',
          message: '新增科目成功'
        });
        this.addSecondSubjectForm=false
        this.secondSubject={}
        this.getSubjectList()
      })
    },
    updateSubject(){
      subject.updateSubjectTitle(this.tempSubject).then(res=>{
        this.$message({
          type: 'success',
          message: '更新科目成功'
        });
        this.updateSubjectForm=false
        this.tempSubject={}
        this.getSubjectList()
      })
    },
    removeSubject(){
      
      
    }

  }
}

  </script>
  
  
  <style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>