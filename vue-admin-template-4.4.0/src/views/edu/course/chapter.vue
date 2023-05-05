<template>
  <div align="center">
    <div class="block" style="width: 50%; height: 700px">
      <el-input
        v-model="filterText"
        placeholder="Filter keyword"
        style="margin-bottom: 30px"
      />
      <el-tree
      class="custom-tree-container"
        ref="tree"
        :data="chapterList"
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        :props="defaultProps"
        draggable
        :allow-drop="allowDrop"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
          style="font-size: large"
        >
          <span v-if="node.data.hasOwnProperty('children')"
            >第{{
              node.parent.data.findIndex((d) => d.id === data.id) + 1
            }}章：{{ node.label }}</span
          >
          <span v-if="!node.data.hasOwnProperty('children')"
            >第{{
              node.parent.data.children.findIndex((d) => d.id === data.id) + 1
            }}节：{{ node.label }}</span
          >
          <span>
            <el-button
              v-if="data.hasOwnProperty('children')"
              type="text"
              @click="() => append(data)"
              style="font-size: large"
            >
              新增小节
            </el-button>
            <el-button
              v-if="data.hasOwnProperty('children')"
              type="text"
              @click="() => edit(data)"
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
        <el-button type="primary" @click="back">返回上一步</el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="dialogFormVisible1 = true"
          >新增章节</el-button
        >
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增章节模态框 -->
    <el-dialog title="添加章节" :visible.sync="dialogFormVisible1">
      <el-form :model="chapter">
        <el-form-item label="章节名称" :label-width="formLabelWidth">
          <el-input v-model="chapter.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="addChapter">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改章节" :visible.sync="dialogFormVisible2">
      <el-form :model="chapter1">
        <el-form-item label="章节名称" :label-width="formLabelWidth">
          <el-input v-model="chapter1.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="updateChapter">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改小节" :visible.sync="dialogFormVisible3">
      <el-form :model="subsection">
        <el-form-item label="小节名称" :label-width="formLabelWidth">
          <el-input v-model="subsection.title" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="updateSubsection">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
  <script>
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import chapter from '@/api/edu/chapter'

let id = 0
export default {
  components: {
    ImageCropper,
    PanThumb
  },
  data() {
    return {
      filterText: '',
      chapterList: [],
      chapter: {title:''},
      chapter1: {id:'',title:''},
      subsection: {id:'',title:''},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      chapterId: 1,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      formLabelWidth: '120px',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {

  },
  methods: {
    next() {
      this.setChapter()
      this.$emit('increment')
    },
    back() {
      this.setChapter()
      this.$emit('decrement')
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    append(data) {
      this.$prompt('请输入小节标题', '新增小节', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        const newChild = { id: data.id + ' ' + id++, title: value };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
        this.$message({
          type: 'success',
          message: '新增小节：' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    edit(node, data) {
      if (node.hasOwnProperty('children')) {
        this.chapter1.id=node.id
        this.chapter1.title = node.title
        this.dialogFormVisible2 = true
      } else {
        this.subsection.id=node.id
        this.subsection.title = node.title
        this.dialogFormVisible3 = true
      }
    },

    remove(node, data) {
      console.log(node);
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    addChapter() {
      const newRoot = { id: this.chapterId++, title: this.chapter.title, children: [] };
      this.dialogFormVisible1 = false
      this.$refs.tree.root.data.push(newRoot)
      this.chapter = {}
      console.log(this);
    },
    updateChapter() {
      const index= this.$refs.tree.root.data.findIndex(d => d.id === this.chapter1.id)
      this.$refs.tree.root.data.splice(index,1,this.chapter1)
      this.dialogFormVisible2 = false
    },
    updateSubsection() {
      
      const index= this.$refs.tree.root.data.children.findIndex(d => d.id === this.subsection.id)
      // this.$refs.tree.root.data.children.splice(index,1,this.subsection)
      this.dialogFormVisible3 = false
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.data.level === dropNode.data.level) {
        if (draggingNode.parent.data.id === dropNode.parent.data.id) {
          return type === "prev" || type === "next";
        } else {
          return false;
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
    setChapter(){
      this.$emit("getChapterInfo",this.chapterList)
    }

  },
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