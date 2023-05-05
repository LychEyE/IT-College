<template>
  <div>
    <div class="app-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input
            v-model="courseQuery.title"
            placeholder="课程标题"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-cascader
            ref="cascader"
            v-model="subjectSelect"
            placeholder="试试搜索：Java"
            @change="subjectChange"
            :options="subjectList"
            filterable
            :props="{
              expandTrigger: 'hover',
              value: 'id',
              label: 'title',
              children: 'children',
            }"
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-select v-model="courseQuery.status" placeholder="状态" clearable>
            <el-option label="未发布" :value="`Draft`"></el-option>
            <el-option label="已发布" :value="`Normal`"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="datepicker"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="dateChange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="getCourseListPage(1)"
            >查询</el-button
          >
          <el-button type="default" @click="resetData()">清空</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="courseList"
        stripe
        fit
        highlight-current-row
        style="width: 100%; text-align: center"
        :header-cell-style="{ background: '#FAFAFA', color: '#515A6E' }"
        border
      >
        <el-table-column type="expand" align="center">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="课程名称">
                <span>{{ props.row.title }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="scope">
            {{ (current - 1) * limit + scope.$index + 1 }}
          </template>
        </el-table-column>

        <el-table-column label="课程名称" prop="title" align="center">
        </el-table-column>

        <!-- <el-table-column label="科目" prop="subjectId" align="center">
          <template slot-scope="scope">
            {{
              subjectList[
                subjectList.findIndex((d) => d.id === scope.row.subjectParentId)
              ].title
            }}
            -
            {{
              subjectList[
                subjectList.findIndex((d) => d.id === scope.row.subjectParentId)
              ].children[
                subjectList[
                  subjectList.findIndex(
                    (d) => d.id === scope.row.subjectParentId
                  )
                ].children.findIndex((d) => d.id === scope.row.subjectId)
              ].title
            }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="讲师" prop="teacherId" align="center">
          <template slot-scope="scope">
            {{
              Object.assign(
                {},
                teacherList[
                  teacherList.findIndex((d) => d.id === scope.row.teacherId)
                ]
              ).name
            }}
          </template>
        </el-table-column> -->

        <el-table-column label="课程价格" prop="price" align="center">
        </el-table-column>
        <el-table-column label="课程课时" prop="lessonNum" align="center">
        </el-table-column>

        <el-table-column label="课程封面" align="center" width="150px">
          <template slot-scope="scope">
            <img :src="scope.row.cover" height="70px" /> </template
        ></el-table-column>
        <el-table-column label="学习人数" prop="buyCount" align="center">
        </el-table-column>
        <el-table-column label="播放数量" prop="viewCount" align="center">
        </el-table-column>

        <el-table-column label="新增日期" align="center">
          <template slot-scope="scope">
            {{ (scope.row.gmtCreate || "").split(" ")[0] }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template slot-scope="scope">
            <el-form>
              <el-form-item style="margin: auto">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showCourseDialog(scope.row)"
                  plain
                  >修改信息</el-button
                >
              </el-form-item>
              <el-form-item style="margin: auto">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showChapterDialog(scope.row)"
                  plain
                  >修改大纲</el-button
                >
              </el-form-item>
              <el-form-item style="margin: auto">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeCourseDataById(scope.row)"
                  plain
                  >删除</el-button
                >
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" align="center">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>

      <el-dialog
        title="修改课程信息"
        :visible.sync="dialogFormVisible1"
        v-if="dialogFormVisible1"
      >
        <el-form :model="tempCourse">
          <el-form-item label="课程名称" :label-width="formLabelWidth">
            <el-input v-model="tempCourse.title"></el-input>
          </el-form-item>

          <el-form-item label="科目" :label-width="formLabelWidth">
            <el-cascader
              ref="cascader1"
              v-model="tempCourse.subjectId"
              placeholder="试试搜索：Java"
              @change="subjectChange2"
              :options="subjectList"
              filterable
              :props="{
                expandTrigger: 'hover',
                value: 'id',
                label: 'title',
                children: 'children',
              }"
            ></el-cascader>
          </el-form-item>

          <!-- <el-form-item label="讲师" :label-width="formLabelWidth">
            <el-select v-model="tempCourse.teacherId" placeholder="请选择讲师">
              <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"
              />
            </el-select>
          </el-form-item> -->

          <el-form-item label="总课时" :label-width="formLabelWidth">
            <el-input-number
              :min="1"
              v-model="tempCourse.lessonNum"
              controls-position="right"
              placeholder="请填写课程的总课时数"
            />
          </el-form-item>

          <el-form-item label="课程价格" :label-width="formLabelWidth">
            <el-input-number
              :min="0"
              v-model="tempCourse.price"
              controls-position="right"
              placeholder="免费课程请设置为0元"
            />
            元
          </el-form-item>

          <el-form-item label="课程封面" :label-width="formLabelWidth">
            <el-upload
              class="upload-demo"
              :action="BASE_API + '/OSS/fileOss'"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleCoverSuccess"
              :before-upload="beforeCoverUpload"
              :file-list="fileList"
              :on-change="onChange"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击更改</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过2MB
              </div>
            </el-upload>
          </el-form-item>

          <el-form-item label="课程简介" :label-width="formLabelWidth">
            <tinymce
              ref="tinymce"
              :height="300"
              v-model="tempCourse.description"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="updateCourseInfo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog
      title="课程大纲"
      :visible.sync="dialogFormVisible2"
      v-if="dialogFormVisible2"
      align="center"
    >
      <div style="width: 75%">
        <el-tree
          class="custom-tree-container"
          ref="tree"
          :data="chapterList"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          draggable
          :allow-drop="allowDrop"
          @node-drag-end="handleDragEnd"
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
                node.parent.data.children.findIndex((d) => d.id === data.id) +
                1
              }}节：{{ node.label }}</span
            >
            <span>
              <el-button
                v-if="data.hasOwnProperty('children')"
                type="text"
                @click="() => addVideo(data, node)"
                style="font-size: large"
              >
                新增小节
              </el-button>
              <el-button
                v-if="data.hasOwnProperty('children')"
                type="text"
                @click="() => edit(data, node)"
                style="font-size: large"
              >
                修改
              </el-button>
              <el-button
                v-if="!data.hasOwnProperty('children')"
                type="text"
                @click="() => editVideo(data, node)"
                style="font-size: large"
              >
                修改
              </el-button>
              <el-popconfirm
                title="确定删除吗？"
                style="margin-left: 10px"
                @onConfirm="() => remove(data, node)"
              >
                <el-button type="text" slot="reference" style="font-size: large"
                  >删除</el-button
                >
              </el-popconfirm>
            </span>
          </span>
        </el-tree>
        <el-form :inline="true" label-width="120px">
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="dialogFormVisible3 = true"
              >新增章节</el-button
            >
          </el-form-item>
        </el-form>
      </div>

      <el-dialog
        width="30%"
        title="修改章节"
        :visible.sync="editInnerVisible"
        append-to-body
        align="center"
      >
        <el-form>
          <el-form-item label="标题" label-width="80px">
            <el-input v-model="currentNode.data.title" />
          </el-form-item>
          <el-button @click="editInnerVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateChapterOrSubsection"
            >确 定</el-button
          >
        </el-form>
      </el-dialog>

      <el-dialog
        width="40%"
        title="修改小节"
        :visible.sync="editInnerVisible2"
        append-to-body
        align="center"
      >
        <el-form>
          <el-form-item label="标题" label-width="80px">
            <el-input v-model="tempVideo.title" />
          </el-form-item>
          <el-form-item label="试看" label-width="80px" align="left">
            <el-radio-group v-model="tempVideo.isFree">
              <el-radio-button label="1">免费</el-radio-button>
              <el-radio-button label="0">收费</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="更换视频" label-width="80px" align="left">
            <el-upload
              :on-success="handleVodUploadSuccess"
              :on-remove="handleVodRemove"
              :before-remove="beforeVodRemove"
              :on-exceed="handleUploadExceed"
              :file-list="videoList"
              :action="BASE_API + '/VOD/video/uploadAliVideo'"
              :limit="1"
              class="upload-demo"
            >
              <el-button size="small" type="primary">上传视频</el-button>
              <el-tooltip placement="right-end">
                <div slot="content">
                  最大支持500MB，<br />
                  支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                  GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                  MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                  SWF、TS、VOB、WMV、WEBM 等视频格式上传
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-button @click="editInnerVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="updateChapterOrSubsection"
            >确 定</el-button
          >
        </el-form>
      </el-dialog>

      <el-dialog
        width="30%"
        title="新增章节"
        :visible.sync="dialogFormVisible3"
        append-to-body
        align="center"
      >
        <el-form>
          <el-form-item label="标题" label-width="80px">
            <el-input v-model="newChapter.title" />
          </el-form-item>
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="addChapterConfirm">确 定</el-button>
        </el-form>
      </el-dialog>

      <el-dialog
        width="40%"
        title="新增小节"
        :visible.sync="editInnerVisible3"
        v-if="editInnerVisible3"
        append-to-body
        align="center"
      >
        <el-form>
          <el-form-item label="标题" label-width="80px">
            <el-input v-model="newVideo.title" />
          </el-form-item>
          <el-form-item label="试看" label-width="80px" align="left">
            <el-radio-group v-model="newVideo.isFree">
              <el-radio-button label="1">免费</el-radio-button>
              <el-radio-button label="0">收费</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传视频" label-width="80px" align="left">
            <el-upload
              :on-success="handleVodUploadSuccess"
              :on-remove="handleVodRemove"
              :before-remove="beforeVodRemove"
              :on-exceed="handleUploadExceed"
              :file-list="videoList"
              :action="BASE_API + '/VOD/video/uploadAliVideo'"
              :limit="1"
              class="upload-demo"
            >
              <el-button size="small" type="primary">上传视频</el-button>
              <el-tooltip placement="right-end">
                <div slot="content">
                  最大支持500MB，<br />
                  支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                  GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                  MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                  SWF、TS、VOB、WMV、WEBM 等视频格式上传
                </div>
                <i class="el-icon-question" />
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-button @click="editInnerVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="addVideoConfrim">确 定</el-button>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import course from '@/api/myCourse'
import subject from '@/api/edu/subject'
import chapter from '@/api/edu/chapter'
import Tinymce from '@/components/Tinymce'
import video from '@/api/edu/video'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      courseQuery: {
        status: '',
      },
      courseList: [],
      total: 0,
      current: 1,
      limit: 10,
      teacherList: [],
      subjectList: [],
      chapterList: [],
      newChapter: { courseId: '', title: '', sort: '' },
      newVideo: { courseId: '', chapterId: '', title: '', sort: '', isFree: 0 },
      fileList: [],
      videoList: [],
      loading: true,
      datepicker: '',
      currentNode: { data: {} },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      formLabelWidth: '120px',//模态框的表格宽度
      BASE_API: process.env.VUE_APP_BASE_API,//获取配置文件中的base_api
      subjectSelect: {},
      tempCourse: { title: '', description: '' },
      tempVideo: {},
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      editInnerVisible: false,
      editInnerVisible2: false,
      editInnerVisible3: false,
      deleteChapterVisible: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      formLabelWidth: '120px',
    }
  },
  created() {
    this.getSubjectList()
    this.getCourseListPage(this.current)
  },

  methods: {
    getCourseListPage(val) {
      this.loading = true
      course
        .getMyCourseListPage(val, this.limit, this.courseQuery)
        .then((response) => {
          //请求成功
          //response接口返回的数据
          this.courseList = response.data.page.records
          this.total = response.data.page.total
        })
        .catch((error) => {
          //请求失败
        })
      this.loading = false
    },
    getDescription(id) {
      course.getDescriptionById(id).then(res => {
        this.$nextTick(() => {
          this.$refs.tinymce.setContent(res.data.description)
        })
        this.tempCourse.description = res.data.description
      })
    },
    getSubjectList() {
      subject.getSubjectList().then(resp => {
        this.subjectList = resp.data.subject
      })
    },
    getChapterById() {
      chapter.getChapterByCourseId(this.tempCourse.id).then(res => {
        this.$nextTick(() => {
          this.chapterList = res.data.chapterList
        })

        console.log(this.chapterList);
      })
    },

    updateCourseInfo() {
      course.updateCourseInfo(this.tempCourse).then(res => {
        this.$message({
          type: 'success',
          message: '更新课程:' + this.tempCourse.title + '成功!'
        })
        this.tempCourse = {}
        this.dialogFormVisible1 = false
        this.getCourseListPage(this.current)
      })
    },

    updateChapterOrSubsection() {
      if (this.currentNode.data.hasOwnProperty('children')) {
        //修改章节名称
        this.updateChapter()
      } else {
        //修改小节
        this.updateSubsection()
      }
      console.log(this.currentNode.data);
    },

    updateChapter() {
      chapter.updateChapter(this.currentNode.data).then(res => {
        this.$message({
          type: 'success',
          message: '更新章节名称成功'
        });
        this.getChapterById()
        this.editInnerVisible = false
      })
    },

    updateSubsection() {
      video.updateSubsection(this.tempVideo).then(res => {
        this.$message({
          type: 'success',
          message: '更新小节成功'
        });
        this.getChapterById()
        this.editInnerVisible2 = false
        this.tempVideo = {}
        this.newVideo.videoSourceId = ''
        this.newVideo.videoOriginalName = ''
        this.tempVideo.videoSourceId = ''
        this.tempVideo.videoOriginalName = ''

      })
    },

    updateSort(val) {
      video.updateSort(val).then(res => {
        this.$message({
          type: 'success',
          message: '更新小节顺序成功'
        });
        this.getChapterById()
      })
    },
    updateChapterSort(val) {
      chapter.updateSort(val).then(res => {
        this.$message({
          type: 'success',
          message: '更新章节顺序成功'
        });
        this.getChapterById()
      })
    },

    addChapter() {
      chapter.addChapter(this.newChapter).then(res => {
        this.$message({
          type: 'success',
          message: '新增章节成功'
        });
        this.getChapterById()
        this.newChapter = {}
        this.dialogFormVisible3 = false
      })
    },


    getVideo(id) {
      video.getVideo(id).then(res => {
        this.tempVideo = res.data.video

      })
    },

    deleteVideoById(val) {
      video.deleteById(val).then(res => {
        this.$message({
          type: 'success',
          message: '删除小节成功'
        });
      })
    },

    deleteChapter(val) {
      chapter.deleteById(val).then(res => {
        this.$message({
          type: 'success',
          message: '删除章节成功'
        });
      })
    },

    resetData() {
      this.courseQuery = {}
      this.datepicker = ''
      this.getCourseListPage(this.current)

    },
    dateChange(val) {
      this.courseQuery.begin = val.toString().split(",")[0]
      this.courseQuery.end = val.toString().split(",")[1]
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val
      this.getCourseListPage(this.current)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.current = val
      this.getCourseListPage(this.current)
    },
    subjectChange(val) {
      this.courseQuery.subjectId = val[1]
    },
    showCourseDialog(val) {
      this.tempCourse = JSON.parse(JSON.stringify(val))
      this.getDescription(this.tempCourse.id)
      this.dialogFormVisible1 = true
      console.log(this.tempCourse);
    },
    showChapterDialog(val) {
      this.tempCourse = JSON.parse(JSON.stringify(val))
      this.getChapterById()
      this.dialogFormVisible2 = true
    },
    subjectChange2(val) {
      this.tempCourse.subjectId = val[1]
    },
    handleRemove(file, fileList) {
      this.tempCourse.cover = 'https://it-college-katsun.oss-cn-guangzhou.aliyuncs.com/resources/CourseDefultCover.jpg'
    },
    handlePreview() {
      this.previewVisible = true
    },
    beforeCoverUpload(file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleCoverSuccess(res, file) {
      this.tempCourse.cover = res.data.url
    },
    onChange(file, list) {
      if (list.length > 1 && file.status !== "fail") {
        list.splice(0, 1);
      } else if (file.status === "fail") {
        errorMsg("上传失败，请重新上传！")
        list.splice(0, 1);
      }
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
    handleDragEnd(draggingNode, dropNode, dropType, ev) {

      console.log('tree drag end: ', draggingNode, dropNode && dropNode.label, dropType);
      if (dropType != 'none') {
        if (dropNode.data.hasOwnProperty('children')) {
          console.log(dropNode.parent.data);
          this.updateChapterSort(dropNode.parent.data)
        } else {
          this.updateSort(dropNode.parent.data)
        }
      }
    },
    edit(data, node) {
      // this.currentNode.title = node.data.title
      // this.currentNode.id=node.data.id
      // this.currentNode.children = node.data.children
      this.currentNode = node
      this.editInnerVisible = true
    },
    editVideo(data, node) {
      this.currentNode = node
      this.getVideo(node.data.id)
      this.editInnerVisible2 = true
      console.log(this.tempVideo);
    },
    addVideo(data, node) {
      console.log(node);
      this.currentNode = node
      this.newVideo.courseId = this.tempCourse.id
      this.newVideo.chapterId = node.data.id
      this.newVideo.sort = node.data.children.length
      this.editInnerVisible3 = true
    },
    addChapterConfirm() {
      this.newChapter.courseId = this.tempCourse.id
      this.newChapter.sort = this.$refs.tree.root.data.length
      this.addChapter()
      console.log(this.newChapter);
    },
    addVideoConfrim() {
      video.addVideo(this.newVideo).then(res => {
        this.$message({
          type: 'success',
          message: '新增小节成功'
        });
        this.getChapterById()
        this.editInnerVisible3 = false
        this.newVideo = {}
        this.videoList = []
        this.newVideo.isFree = 0
      })
    },

    remove(data, node) {
      const id = node.data.id
      if (!node.data.hasOwnProperty('children')) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        this.deleteVideoById(id)
      }
      else {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        this.deleteChapter(id)
      }
    },
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.newVideo.videoSourceId = response.data.videoId
      this.newVideo.videoOriginalName = file.name
      this.tempVideo.videoSourceId = response.data.videoId
      this.tempVideo.videoOriginalName = file.name
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    //点击确定删除调用的方法
    handleVodRemove() {
      //调用接口的删除视频的方法
      video.deleteAliVod(this.newVideo.videoSourceId).then(res => {
        this.$message({
          type: 'success',
          message: '取消视频成功'
        });
        this.videoList = []
        this.newVideo.videoSourceId = ''
        this.newVideo.videoOriginalName = ''
        this.tempVideo.videoSourceId = ''
        this.tempVideo.videoOriginalName = ''

      })
    },
    //点击x调用这个方法
    beforeVodRemove(file) {
      return this.$confirm(`确定删除${file.name}?`)

    },
    removeCourseDataById(val) {
      this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.deleteCourse(val.id).then(res => {
          this.$message({
            type: 'success',
            message: '删除课程成功'
          });
          this.getCourseListPage(this.current)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });


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