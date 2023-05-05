import request from "@/utils/request";

export default {
  // 根据课程id获取评论信息
  getCommentList(courseId) {
    return request({
      
      url: `/eduservice/comment/getCommentList/${courseId}`,
      method: "get",
    });
  },

  // 添加一条评论记录
  addComment(current,parent) {
    return request({
      url: `/eduservice/comment/addComment`,
      method: "post",
      data:{current,parent}
    });
  },

  // 根据评论id删除一条记录 
  deleteCommentById(current) {
    return request({
      url: `/eduservice/comment/deleteCommentById`,
      method: "delete",
      data:current
    });
  },

   // 修改评论的点赞数量
   updateLikeCount(comment) {
    return request({
      url: `/eduservice/comment/updateLikeCount`,
      method: "post",
      data:comment
    });
  },

};