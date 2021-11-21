<template>
  <div id="container">
    <div id="title">
      <p id="label">
        <span><i class="el-icon-d-arrow-left hand-logo" @click="backBtn"></i></span>
        <span><i class="el-icon-d-arrow-right hand-logo"></i></span>
        <span><i class="el-icon-refresh hand-logo" @click="refreshBtn"></i></span>
        <span>地址：</span>
        </p>
      <el-input v-model="location" size="small"></el-input>
    </div>
    <div id="main">
      <el-tree :data="treeData" :props="defaultProps" :default-expand-all="true" @node-click="handleNodeClick" id="tree"></el-tree>
      <el-table
          @row-click="rowClick"
          :data="tableData1"
          size="small"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="文件名">
        </el-table-column>
        <el-table-column
            prop="type"
            label="类型"
            width="180">
          <template slot-scope="scope">
            {{scope.row | typeFormat}}
          </template>
        </el-table-column>
        <el-table-column
            prop="date"
            label="日期">
        </el-table-column>
        <el-table-column
            prop="size"
            label="大小">
          <template slot-scope="scope">
            {{scope.row.size | fileSizeFormat}}
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
// var path = require('path')
import {runExec} from '../../api/cmd'
import * as StringUtils from '../../util/string_utils'
var iconv = require('iconv-lite')
var fs = require('fs')
export default {
  name: 'landing-page',
  data () {
    return {
      location: '',
      locationBak: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],
      tableData1: [],
      driverArray: []
    }
  },
  created () {
    this.readDriver()
  },
  mounted () {
    this.loadTree()
  },
  methods: {
    loadTree () {
      console.log('loadTree')
    },
    readDriver () {
      let workerProcess = runExec('wmic logicaldisk get caption', '')
      let _this = this
      workerProcess.stdout.on('data', function (data) {
        let text = iconv.decode(Buffer.from(data), 'GBK')
        if (text) {
          let itemString = text.split('\n').filter(item => StringUtils.isDriveString(item))
          itemString = itemString.map(item => { return item.replace(/^\s*|\s*$/g, '') })
          _this.driverArray = itemString
          _this.readTree()
          _this.readDirectory(itemString[0])
        }
      })
    },
    readTree () {
      // this.driverArray
      // this.treeData = []
      this.treeData = this.driverArray.map(item => {
        return {label: item.replace(':', ''), path: item, children: []}
      })
    },
    readDirectory (filePath) {
      console.log('当前路径3', filePath)
      let workerProcess = runExec('dir', filePath)
      let _this = this
      workerProcess.stdout.on('data', function (data) {
        let text = iconv.decode(Buffer.from(data), 'GBK')
        if (text) {
          let itemString = text.split('\n').filter(item => StringUtils.isFileString(item))
          let res = itemString.map(item => {
            return StringUtils.arrayToObject(StringUtils.stringToArray(item))
          })
          _this.tableData1 = res.map(i => {
            i.parentFile = `${filePath.trim()}\\\\${i.name}`
            return i
          })
          _this.$forceUpdate()
        }
      })
    },
    rowClick (row, column, event) {
      if (row.type === '<DIR>' && !(row.name.length < 4 && row.name.indexOf('.') === 0)) {
        this.location = row.parentFile
        this.locationBak = this.location
        this.readDirectory(row.parentFile)
      } else {
        this.$message.warning('这不是目录了,请右键下载查看！')
      }
    },
    readDirectory2 (dir) {
      let files = fs.readdirSync(dir)
      files.forEach(item => {
        if (!item.includes('$')) {
          let filepath1 = dir + '\\' + item
          let stat = fs.statSync(filepath1)
          if (stat.isFile()) {
            console.log(filepath1)
          } else {
            this.readDirectory(filepath1)
          }
        }
      })
    },
    handleNodeClick (data) {
      console.log('当前路径2', data.path)
      this.readDirectory(data.path)
    },
    backBtn () {
      let address = this.location.split('\\\\')
      console.log(address)
      if (address.length > 1) {
        this.location = address.filter((item, index) => index < address.length - 1).join('\\\\')
        this.locationBak = this.location
        this.readDirectory(this.location)
      } else {
        this.$message.warning('已经到根目录了！')
      }
    },
    refreshBtn () {
      this.readDirectory(this.locationBak)
    }
  }
}
</script>

<style lang="scss">
.hand-logo{
  cursor:pointer;
}
#container{
  padding: 10px;
}
#title{
  display: flex;
  align-items: center;
  #label{
    width: 160px;
    font-size: 20px;
    //line-height: px;
  }
}
#main {
 display: flex;
  #tree{
    width: 180px;
  }
}

</style>
