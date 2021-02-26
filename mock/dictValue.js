const Mock = require('mockjs')

module.exports = [
  {
    url: '/vue-element-admin/getList/dict',
    type: 'get',
    response: config => {
      const { keyword, dictCode } = config.query
      const NameList = []
      if (dictCode === '668899') {
        for (let i = 0; i < 20; i++) {
          NameList.push(Mock.mock({
            label: '@province()',
            id: '@id',
            'options|4-9': [
              {
                label: '@city()',
                value: '@city()',
                id: '@id'
              }
            ]
          }))
        }
      } else {
        for (let i = 0; i < 100; i++) {
          NameList.push(Mock.mock({
            label: '@cname()',
            value: '@cname()',
            id: '@id',
            disabled: i % 3 === 0
          }))
        }
      }
      const mockNameList = NameList.filter(item => {
        const lowerCaseName = item.label.toLowerCase()
        return !(keyword && lowerCaseName.indexOf(keyword.toLowerCase()) < 0)
      })
      return {
        code: 200,
        result: mockNameList,
        message: true,
        timestamp: +Mock.Random.date('T')
      }
    }
  },

  // @county list
  {
    url: '/vue-element-admin/county/list',
    type: 'get',
    response: config => {
      const { keyword } = config.query
      const CountyList = []
      for (let index = 0; index < 50; index++) {
        CountyList.push(Mock.mock({
          label: '@county',
          value: '@county',
          id: '@id()'
        }))
      }
      const mockNameList = CountyList.filter(item => {
        return (keyword && (item.value.indexOf(keyword) !== -1 || item.label.indexOf(keyword) !== -1))
      })
      return {
        code: 200,
        result: mockNameList,
        message: true,
        timestamp: +Mock.Random.date('T')
      }
    }
  },
  // cascader

  {
    url: '/vue-element-admin/sascaderList/list',
    type: 'get',
    response: config => {
      const sascaderList = []
      for (let index = 0; index < 20; index++) {
        sascaderList.push({
          label: '@province()',
          value: '@province()',
          id: '@id',
          'children|4-7': [
            {
              label: '@city()',
              value: '@city()',
              id: '@id()',
              'children|2-5': [
                {
                  label: '@county',
                  value: '@county',
                  id: '@id'
                }
              ]
            }
          ]
        })
      }
      return {
        code: 200,
        result: sascaderList,
        message: true,
        timestamp: +Mock.Random.date('T')
      }
    }
  }
]

//    timestamp: +Mock.Random.date('T'),
