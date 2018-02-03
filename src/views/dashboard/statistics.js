const getTotalOptions = (data) => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    toolbox: {
      right: '20px',
      feature: {
        magicType: {
          type: ['line', 'bar']
        }
      }
    },
    legend: {
      data: data.dataNames
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: data.xAxis
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [{
        name: data.values[0].name,
        type: 'bar',
        data: data.values[0].data
      },
      {
        name: data.values[1].name,
        type: 'bar',
        data: data.values[1].data
      },
      {
        name: data.values[2].name,
        type: 'bar',
        data: data.values[2].data
      }
    ]
  }
}

const getClickOptions = (data) => {
  return {
    title: {
      text: '朋友圈点击量',
      subtext: '按时间段',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.legendData
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: data.data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
}

const getScanOptions = (data) => {
  return {
    title: {
      text: '扫码量',
      subtext: '按时间段',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: data.legendData
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: data.data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
}
export { getTotalOptions, getClickOptions, getScanOptions }
