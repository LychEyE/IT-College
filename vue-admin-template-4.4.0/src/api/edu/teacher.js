import request from '@/utils/request'

export default {
    //1、讲师列表(条件查询分页)
    getTeacherListPage(current, limit, teacherQueryVo) {
        return request({
            url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            //teacherQueryVo条件对象，后端使用requestbody接收数据
            //data表示把对象转换json进行传递到接口里
            data: teacherQueryVo,
            // params: current,limit
        })
    },
    //根据id删除讲师
    deleteTeacherById(id) {
        return request({
            url: `/eduservice/teacher/${id}`,
            method: 'delete',
        })
    },
    //新增讲师
    save(teacher) {
        return request({
            url: '/eduservice/teacher',
            method: 'put',
            data: teacher
        })
    },
    getAllTeacherList(){
        return request({
            url: `/eduservice/teacher`,
            method: 'get',
        })
    }

}