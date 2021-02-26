<template>
  <div>
    <h1>App</h1>
    <BaseIcon type="fa-user" />

    <el-button @click="visable=true">
      show dialog
    </el-button>
    <BaseButtonOperator
      @handle-save="handleSave"
      @handle-cancel="handleCancel"
    />
    <base-dialog
      :visible.sync="visable"
      title="dialog test"
    >
      <div slot="footer">
        <BaseButtonOperator @handle-cancel="handleCancel" />
      </div>
    </base-dialog>
    <el-row>
      <div class="dict">
        <dict-selector
          v-model="m1"
          dict-type="abcd"
          filterable
          multiple
          @change="changeParent"
        />
        <!-- <dict-selector v-model="m2" :outfilter="outfilter" /> -->
        <dict-selector
          v-model="m3"
          dict-type="abcd"
          custom
          @change="changeParent"
        />
        <auto-complete
          v-model="m4"
          custom
        />
      </div>
    </el-row>

    <el-row>
      <h3>级联选择</h3>
      <div class="dict">
        <BaseCascader
          v-model="m5"
          dict-type="abcd"
        />
        <!--  :props="{checkStrictly: true,expandTrigger: 'hover' }" -->
        <base-cascader
          v-model="m6"
          dict-type="abcd"
          :props="{checkStrictly: true }"
        />
        <BaseCascader
          v-model="m7"
          :options="options"
          custom
          :props="{multiple: true, checkStrictly: true }"
        />
      </div>
    </el-row>

    <h3>文件上传</h3>
    <!-- <auto-complete /> -->
    <attachment
      ref="attachment"
      :limit="6"
      disabled
      is-drag
      :options="{id:'SN9988',name:'20201121-项目启动.pdf'}"
    />
    <!-- <attachment :limit="2" disabled :options="{id:'SN9988',name:'20201121-项目启动.pdf'}" /> -->
    <!-- is-drag -->
    <el-row>
      <h3>下拉框分组</h3>
      <div class="dict">
        <dict-selector
          v-model="groupValue"
          is-group
          filterable
          custom
          dict-type="668899"
          @change="changeParent"
        />
        <dict-selector
          v-model="groupValue1"
          is-group
          filterable
          custom
          multiple
          :outfilter="outfilter"
          @change="changeParent"
        />
      </div>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'App',

  data() {
    return {
      buttons: [
        {
          text: '关注',
          callback: 'handleGuanzhu',
          props: {
            type: 'danger',
            icon: '',
            className: ''
          }
        }
      ],
      visable: false,
      outfilter: [
        {
          label: '热门城市',
          options: [{
            value: '上海',
            label: '上海'
          }, {
            value: '北京',
            label: '北京'
          }]
        },
        {
          label: '城市名',
          options: [{
            value: '成都',
            label: '成都',
            disabled: true
          }, {
            value: '深圳',
            label: '深圳'
          }, {
            value: '广州',
            label: '广州'
          }, {
            value: '大连',
            label: '大连'
          }]
        }
      ],
      groupValue: '',
      groupValue1: '',

      m1: '',
      m2: '',
      m3: '',
      m4: '',
      m5: '',
      m6: '',
      m7: '',
      m8: '',
      options: [
        {
          label: '江苏省',
          value: '江苏省',
          id: '23456',
          children: [
            {
              label: '苏州市',
              value: '苏州市',
              id: '',
              children: [
                {
                  label: '工业园区',
                  value: '工业园区'
                }
              ]
            },
            {
              label: '昆山市',
              value: '昆山市',
              id: ''
            }
          ]
        }
      ]
    }
  },
  created() {

  },
  methods: {
    changeParent(v) {
      console.log(v)
    },

    handleSave(vl) {
      this.$refs.attachment.upload()
    },
    handleCancel(vl) {
      console.log(vl)
      this.visable = false
    }
  }
}
</script>

<style lang="scss" >
  .dict{
    margin: 20px auto;
    display: grid;
    grid-template-columns: 356px 356px 356px;
    &>div{
      width: 300px;
      &>div{
        width: 100%;
      }
    }
  }
</style>
