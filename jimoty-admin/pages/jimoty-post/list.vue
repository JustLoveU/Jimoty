<template>
	<view>
		<view class="uni-header">
			<view class="uni-group">
				<view class="uni-title"></view>
				<view class="uni-sub-title"></view>
			</view>
			<view class="uni-group">
				<input class="uni-search" type="text" v-model="query" @confirm="search" placeholder="请输入搜索内容" />
				<button class="uni-button" type="default" size="mini" @click="search">搜索</button>
				<button class="uni-button" type="default" size="mini" @click="navigateTo('./add')">新增</button>
				<button class="uni-button" type="default" size="mini" :disabled="!selectedIndexs.length"
					@click="delTable">批量删除</button>
				<download-excel class="hide-on-phone" :fields="exportExcel.fields" :data="exportExcelData"
					:type="exportExcel.type" :name="exportExcel.filename">
					<button class="uni-button" type="primary" size="mini">导出 Excel</button>
				</download-excel>
			</view>
		</view>
		<view class="uni-container">
			<unicloud-db ref="udb" :collection="collectionList"
				field="userId,type,category,photos,point,recruitAge,noteTitle,mainText,companyName,payrollForm,salary,salarySupplement,traffic,workTime,workPosition,phone,employeeForm,sex,age,sterOperation,vaccinelnoculation,releaseReason,payMethod,postPrice,status,delete,browse,weight,collect,hightLight,location,location,create_date,update_date"
				:where="where" page-data="replace" :orderby="orderby" :getcount="true" :page-size="options.pageSize"
				:page-current="options.pageCurrent" v-slot:default="{data,pagination,loading,error,options}"
				:options="options" loadtime="manual" @load="onqueryload">
				<uni-table ref="table" :loading="loading" :emptyText="error.message || '没有更多数据'" border stripe
					type="selection" @selection-change="selectionChange">
					<uni-tr>
						<uni-th align="center" filter-type="search" sortable
							@sort-change="sortChange($event, 'userId')">发布者</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'type')"
							sortable @sort-change="sortChange($event, 'type')">类目</uni-th>
						<uni-th align="center" filter-type="search"
							@sort-change="sortChange($event, 'category')">类别</uni-th>
						<uni-th align="center" @sort-change="sortChange($event, 'photos')">图片</uni-th>
						<uni-th align="center" sortable @sort-change="sortChange($event, 'point')">地理位置</uni-th>
						<uni-th align="center" @filter-change="filterChange($event, 'recruitAge')"
							@sort-change="sortChange($event, 'recruitAge')">招募年龄</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'noteTitle')"
							@sort-change="sortChange($event, 'noteTitle')">标题</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'mainText')"
							@sort-change="sortChange($event, 'mainText')">正文</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'companyName')"
							@sort-change="sortChange($event, 'companyName')">公司名</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'payrollForm')"
							@sort-change="sortChange($event, 'payrollForm')">工资形式</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'salary')"
							sortable @sort-change="sortChange($event, 'salary')">薪资</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'salarySupplement')" sortable
							@sort-change="sortChange($event, 'salarySupplement')">工资补充</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'traffic')"
							@sort-change="sortChange($event, 'traffic')">交通</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'workTime')"
							sortable @sort-change="sortChange($event, 'workTime')">工作时间</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'workPosition')"
							@sort-change="sortChange($event, 'workPosition')">工作地点</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'phone')"
							@sort-change="sortChange($event, 'phone')">电话</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'employeeForm')"
							@sort-change="sortChange($event, 'employeeForm')">雇佣形式</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'sex')"
							@sort-change="sortChange($event, 'sex')">性别</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'age')"
							sortable @sort-change="sortChange($event, 'age')">年龄</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'sterOperation')"
							@sort-change="sortChange($event, 'sterOperation')">绝育手术</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'vaccinelnoculation')"
							@sort-change="sortChange($event, 'vaccinelnoculation')">疫苗接种</uni-th>
						<uni-th align="center" filter-type="search"
							@filter-change="filterChange($event, 'releaseReason')"
							@sort-change="sortChange($event, 'releaseReason')">投稿理由</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'payMethod')"
							@sort-change="sortChange($event, 'payMethod')">支付方式</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'postPrice')"
							@sort-change="sortChange($event, 'postPrice')">商品价格</uni-th>
						<uni-th align="center" filter-type="search" @filter-change="filterChange($event, 'status')"
							sortable @sort-change="sortChange($event, 'status')">帖子状态</uni-th>
						<uni-th align="center" @filter-change="filterChange($event, 'delete')"
							@sort-change="sortChange($event, 'delete')">逻辑删除</uni-th>
						<uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'browse')"
							sortable @sort-change="sortChange($event, 'browse')">浏览数</uni-th>
						<uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'weight')"
							sortable @sort-change="sortChange($event, 'weight')">权重</uni-th>
						<uni-th align="center" filter-type="range" @filter-change="filterChange($event, 'collect')"
							sortable @sort-change="sortChange($event, 'collect')">收藏数</uni-th>
						<uni-th align="center" @sort-change="sortChange($event, 'hightLight')">高亮</uni-th>
						<uni-th align="center" @sort-change="sortChange($event, 'location')">地理位置</uni-th>
						<!-- <uni-th align="center" sortable @sort-change="sortChange($event, 'location')">地理位置</uni-th> -->
						<uni-th align="center" filter-type="timestamp"
							@filter-change="filterChange($event, 'create_date')" sortable
							@sort-change="sortChange($event, 'create_date')">create_date</uni-th>
						<uni-th align="center" filter-type="timestamp"
							@filter-change="filterChange($event, 'update_date')" sortable
							@sort-change="sortChange($event, 'update_date')">update_date</uni-th>
						<uni-th align="center">操作</uni-th>
					</uni-tr>
					<uni-tr v-for="(item,index) in data" :key="index">
						<uni-td align="center">{{item.userId}}</uni-td>
						<uni-td align="center">{{item.type}}</uni-td>
						<uni-td align="center">{{item.category}}</uni-td>
						<uni-td align="center">{{item.photos}}</uni-td>
						<uni-td align="center">{{item.point}}</uni-td>
						<uni-td align="center">{{item.recruitAge}}</uni-td>
						<uni-td align="center">{{item.noteTitle}}</uni-td>
						<uni-td align="center">{{item.mainText}}</uni-td>
						<uni-td align="center">{{item.companyName}}</uni-td>
						<uni-td align="center">{{item.payrollForm}}</uni-td>
						<uni-td align="center">{{item.salary}}</uni-td>
						<uni-td align="center">{{item.salarySupplement}}</uni-td>
						<uni-td align="center">{{item.traffic}}</uni-td>
						<uni-td align="center">{{item.workTime}}</uni-td>
						<uni-td align="center">{{item.workPosition}}</uni-td>
						<uni-td align="center">{{item.phone}}</uni-td>
						<uni-td align="center">{{item.employeeForm}}</uni-td>
						<uni-td align="center">{{item.sex}}</uni-td>
						<uni-td align="center">{{item.age}}</uni-td>
						<uni-td align="center">{{item.sterOperation}}</uni-td>
						<uni-td align="center">{{item.vaccinelnoculation}}</uni-td>
						<uni-td align="center">{{item.releaseReason}}</uni-td>
						<uni-td align="center">{{item.payMethod}}</uni-td>
						<uni-td align="center">{{item.postPrice}}</uni-td>
						<uni-td align="center">{{item.status}}</uni-td>
						<uni-td align="center">{{item.delete == true ? '✅' : '❌'}}</uni-td>
						<uni-td align="center">{{item.browse}}</uni-td>
						<uni-td align="center">{{item.weight}}</uni-td>
						<uni-td align="center">{{item.collect}}</uni-td>
						<uni-td align="center">{{item.hightLight == true ? '✅' : '❌'}}</uni-td>
						<uni-td align="center">{{item.location}}</uni-td>

						<uni-td align="center">
							<uni-dateformat :threshold="[0, 0]" :date="item.create_date"></uni-dateformat>
						</uni-td>
						<uni-td align="center">
							<uni-dateformat :threshold="[0, 0]" :date="item.update_date"></uni-dateformat>
						</uni-td>
						<uni-td align="center">
							<view class="uni-group">
								<button @click="navigateTo('./edit?id='+item._id, false)" class="uni-button" size="mini"
									type="primary">修改</button>
								<button @click="confirmDelete(item._id,item.photos)" class="uni-button" size="mini"
									type="warn">删除</button>
							</view>
						</uni-td>
					</uni-tr>
				</uni-table>
				<view class="uni-pagination-box">
					<uni-pagination show-icon :page-size="pagination.size" v-model="pagination.current"
						:total="pagination.count" @change="onPageChanged" />
				</view>
			</unicloud-db>
		</view>
	</view>
</template>

<script>
	import { enumConverter, filterToWhere } from '../../js_sdk/validator/jimoty-post.js';

	const db = uniCloud.database()
	// 表查询配置
	const dbOrderBy = '' // 排序字段
	const dbSearchFields = [] // 模糊搜索字段，支持模糊搜索的字段列表。联表查询格式: 主表字段名.副表字段名，例如用户表关联角色表 role.role_name
	// 分页配置
	const pageSize = 20
	const pageCurrent = 1

	const orderByMapping = {
		"ascending": "asc",
		"descending": "desc"
	}

	const categoryType = {
		1: '社交',
		2: '兼职',
		3: '教培',
		4: '领养',
		5: '闲置'
	}

	export default {
		data() {
			return {
				collectionList: "jimoty-post",
				query: '',
				where: '',
				orderby: dbOrderBy,
				orderByFieldName: "",
				selectedIndexs: [],
				options: {
					pageSize,
					pageCurrent,
					filterData: {},
					...enumConverter
				},
				imageStyles: {
					width: 64,
					height: 64
				},
				exportExcel: {
					"filename": "jimoty-post.xls",
					"type": "xls",
					"fields": {
						"发布者": "userId",
						"类目": "type",
						"类别": "category",
						"图片": "photos",
						"地理位置": "location",
						"招募年龄": "recruitAge",
						"标题": "noteTitle",
						"正文": "mainText",
						"公司名": "companyName",
						"工资形式": "payrollForm",
						"薪资": "salary",
						"工资补充": "salarySupplement",
						"交通": "traffic",
						"工作时间": "workTime",
						"工作地点": "workPosition",
						"电话": "phone",
						"雇佣形式": "employeeForm",
						"性别": "sex",
						"年龄": "age",
						"绝育手术": "sterOperation",
						"疫苗接种": "vaccinelnoculation",
						"投稿理由": "releaseReason",
						"支付方式": "payMethod",
						"商品价格": "postPrice",
						"帖子状态": "status",
						"逻辑删除": "delete",
						"浏览数": "browse",
						"权重": "weight",
						"收藏数": "collect",
						"高亮": "hightLight",
						"create_date": "create_date",
						"update_date": "update_date"
					}
				},
				exportExcelData: []
			}
		},
		onLoad() {
			this._filter = {}
		},
		onReady() {
			this.$refs.udb.loadData()
		},
		methods: {
			onqueryload(data) {
				this.exportExcelData = data
			},
			getWhere() {
				const query = this.query.trim()
				if (!query) {
					return ''
				}
				const queryRe = new RegExp(query, 'i')
				return dbSearchFields.map(name => queryRe + '.test(' + name + ')').join(' || ')
			},
			search() {
				const newWhere = this.getWhere()
				this.where = newWhere
				this.$nextTick(() => {
					this.loadData()
				})
			},
			loadData(clear = true) {
				this.$refs.udb.loadData({
					clear
				})
			},
			onPageChanged(e) {
				this.selectedIndexs.length = 0
				this.$refs.table.clearSelection()
				this.$refs.udb.loadData({
					current: e.current
				})
			},
			navigateTo(url, clear) {
				// clear 表示刷新列表时是否清除页码，true 表示刷新并回到列表第 1 页，默认为 true
				uni.navigateTo({
					url,
					events: {
						refreshData: () => {
							this.loadData(clear)
						}
					}
				})
			},
			// 多选处理
			selectedItems() {
				var dataList = this.$refs.udb.dataList
				return this.selectedIndexs.map(i => dataList[i]._id)
			},
			// 批量删除
			delTable() {
				this.$refs.udb.remove(this.selectedItems(), {
					success: (res) => {
						this.$refs.table.clearSelection()
					}
				})
			},
			// 多选
			selectionChange(e) {
				this.selectedIndexs = e.detail.index
			},
			confirmDelete(id, photos) {
				this.$refs.udb.remove(id, {
					success: async (res) => {
						//删除相关的图片
						await uniCloud?.deleteFile({
							fileList: [...photos], // 文件ID数组
							success: (res) => {
								console.log('文件删除成功', res);
							},
							fail: (err) => {
								console.error('文件删除失败', err);
							},
							complete() {
								console.error('文件删除失败', err);
							}
						})
						this.$refs.table.clearSelection()
					}
				})


			},
			sortChange(e, name) {
				this.orderByFieldName = name;
				if (e.order) {
					this.orderby = name + ' ' + orderByMapping[e.order]
				} else {
					this.orderby = ''
				}
				this.$refs.table.clearSelection()
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			},
			filterChange(e, name) {
				this._filter[name] = {
					type: e.filterType,
					value: e.filter
				}
				let newWhere = filterToWhere(this._filter, db.command)
				if (Object.keys(newWhere).length) {
					this.where = newWhere
				} else {
					this.where = ''
				}
				this.$nextTick(() => {
					this.$refs.udb.loadData()
				})
			}
		}
	}
</script>

<style>
</style>