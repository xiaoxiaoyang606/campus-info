// 课堂作业八：自习室筛选与使用统计
// 1.自习室数据（写在JS数组，共12间）
const rooms = [
    {name:'一楼东自习室', floor:1, status:'开放', seats:120, used:86},
    {name:'一楼西自习室', floor:1, status:'开放', seats:100, used:41},
    {name:'二楼研讨区', floor:2, status:'开放', seats:60, used:55},
    {name:'二楼静音区', floor:2, status:'开放', seats:80, used:72},
    {name:'三楼综合自习室', floor:3, status:'闭馆', seats:150, used:0},
    {name:'三楼专研专区', floor:3, status:'开放', seats:90, used:88},
    {name:'四楼电子阅览室', floor:4, status:'开放', seats:70, used:30},
    {name:'四楼研修区', floor:4, status:'维修', seats:40, used:0},
    {name:'四楼普通话区', floor:4, status:'开放', seats:50, used:12},
    {name:'一楼24小时区', floor:1, status:'开放', seats:30, used:28},
    {name:'二楼期刊阅览区', floor:2, status:'维修', seats:45, used:0},
    {name:'三楼教师阅览室', floor:3, status:'闭馆', seats:35, used:0},
];
const floorFilter = document . querySelector ( '#floor-filter' );
const statusFilter = document . querySelector ( '#status-filter' );
const listBox = document . querySelector ( '#room-list' );
const renderRooms = ( ) => { 
    const floor = floorFilter. value ;
    const status = statusFilter. value ;
    listBox. innerHTML = '' ;
    const shown = rooms. filter ( r => (floor === 'all' || r. floor === Number (floor)) &&
    (status === 'all' || r. status === status)
  );
   if (shown. length === 0 ) { const li = document . createElement ( 'li' );
    li. className = 'list-group-item text-muted' ;
    li. textContent = '没有符合条件的自习室' ;
    listBox. appendChild (li); return ;
  }
  shown. forEach ( r => { const li = document . createElement ( 'li' );
    li. className = 'list-group-item d-flex justify-content-between' ;
    li. textContent = r. name + '（' + r. floor + '层 · ' + r. status + '）' ; const span = document . createElement ( 'span' );
    span. className = 'text-muted' ;
    span. textContent = '空余 ' + (r. seats- r. used ) + ' 座' ;
    li. appendChild (span);
    listBox. appendChild (li);
  });
};
floorFilter.addEventListener('change',renderRooms);
statusFilter.addEventListener('change',renderRooms);
renderRooms();

const statusBox = document.querySelector('#status');
const chartBox = document.querySelector('#usage-chart');
let usageChart = null;

const loadChart = async () => {
  statusBox.textContent = '数据加载中…';
  statusBox.style.display = 'block';
  try {
    const response = await fetch('data/data.json');
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    const data = await response.json();
    if (!data.rooms || data.rooms.length === 0) {
      statusBox.textContent = '暂无统计数据';
      return;
    }
    statusBox.style.display = 'none';

    const names = data.rooms.map(r => r.name);
    const free = data.rooms.map(r => r.seats - r.occupied);

    if (usageChart === null) {
      usageChart = echarts.init(chartBox);
    }
    usageChart.setOption({
      title: {
        text: '各自习室空余座位数（单位：座）',
        subtext: '数据来源：' + data.source,
        left: 'center'
      },
      tooltip: { trigger: 'axis' },
      grid: { left: 60, right: 30, bottom: 120, top: 80 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { rotate: 35, interval: 0 }
      },
      yAxis: { type: 'value', name: '空余座位（座）' },
      series: [{ name: '空余座位', type: 'bar', data: free }]
    });
  } catch (error) {
    statusBox.textContent = '加载失败：' + error.message;
    statusBox.style.display = 'block';
  }
};

loadChart();
window.addEventListener('resize', () => {
  if (usageChart) usageChart.resize();
});