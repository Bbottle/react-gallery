
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


let imagesData = require('../data/imageDatas.json');
const Constant = {
		centerPos : {   //中心位置
			left : 0,
			right : 0
		},
		hPosRange : {	//水平范围
			leftSecX : [0,0],
			rightSecX : [0,0],
			y : [0,0]
		}, 
		vPosRange : {   //垂直范围
			x : [0,0],
			topY : [0,0]
		}
	}
// alert(imagesList)
class ImageBoxComponent extends React.Component{
	constructor(props){
		super (props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(e){

		e.stopPropagation();
		e.preventDefault();

		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.iscenter();
		}

	}
	render(){
		let styleObj = {};
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos
		}
		if(this.props.arrange.rotate){
			['WebkitTransform','MozTransform','msTransform','transform'].forEach((value)=>{
				styleObj[value]= 'rotate(' + this.props.arrange.rotate + 'deg)';
			})
			//这种写法不行，会报错
			// ['-wekit-','-moz-','-ms-',''].forEach((value)=>{
			// 	styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			// })
		}

		if(this.props.arrange.isCenter){
			styleObj.zIndex = 111;
		}

		let imgBoxClassName = 'image-box';
		imgBoxClassName += this.props.arrange.isInverse ? ' box-inverse' : '';

		return(
			<div className={imgBoxClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.itemImage} />
				<div className="image-box-title">
					<span>{this.props.data.title}</span>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.itemName}
						</p>
					</div>
				</div>
			</div>
		)
	}
}

class AppComponent extends React.Component {
	constructor(props){
		super (props);
		this.state = {
			imgsRangArr : []
			// imgsRangArr :[
			// 	{
			// 		pos : {
			// 			left: 0,
			// 			top: 0
			// 		},
			// 		rotate : 0 ,
			// 		isInverse : false,
			// 		isCenter : true	
			// 	}]
		};
		// this.handleClick = this.handleClick.bind(this);
	}
	getRandomValue(low,high){ //随机取出最小值到最大值之间的值
		return Math.ceil( Math.random() * ( high - low ) + low );
	}
	getRotateRandom(){ //随机取出0~30度的数值
		return ( (Math.random() > 0.5 ? '' : '-') + Math.ceil( Math.random() * 30 ) );
	}
	isInverseFun(ind){//当前图片反转
		return  ()=> {
			this.state.imgsRangArr[ind].isInverse = !this.state.imgsRangArr[ind].isInverse;
			
			//每次修改状态值，记得重新赋值，修改原来的数据
			this.setState({
				imgsRangArr : this.state.imgsRangArr
			})
		};
	}
	isCenterFun(ind){
		return ()=>{
			this.rearrange(ind)
		}
	}
	rearrange(centerIndex){
		let imgsRangArr = this.state.imgsRangArr,
			// Constant = this.Constant,
			centerPos = Constant.centerPos,
			vPosRange = Constant.vPosRange,
			hPosRange = Constant.hPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY,

			imgsRangTopArr = [],
			topImgNum = Math.ceil(Math.random()*2),
			topImgSplicIndex = 0,
			imgsRangCenterArr = imgsRangArr.splice(centerIndex,1);

			//居中的图片
			imgsRangCenterArr[0] = {
				pos : centerPos,
				rotate : 0,
				isCenter : true
			}

			//取出要布局上侧的图片状态信息
			topImgSplicIndex = Math.ceil( Math.random() * (imgsRangArr.length - topImgNum) );
			imgsRangTopArr = imgsRangArr.splice(topImgSplicIndex,topImgNum);

			imgsRangTopArr.forEach((value,index)=>{
				imgsRangTopArr[index] = {
					pos : {
						left : this.getRandomValue(vPosRangeX[0],vPosRangeX[1]),
						top : this.getRandomValue(vPosRangeTopY[0],vPosRangeTopY[1])
					},
					rotate : this.getRotateRandom(),
					isCenter : false
				}
			})

			//左右分区的图片状态信息
			for(let i = 0 , j = imgsRangArr.length, k = j / 2; i < j ; i ++){
				let hPosRangeLORX = null;
				if( i < k ){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsRangArr[i] = {
					pos : {
						left : this.getRandomValue(hPosRangeLORX[0],hPosRangeLORX[1]),
						top : this.getRandomValue(hPosRangeY[0],hPosRangeY[1])
					},
					rotate : this.getRotateRandom(),
					isCenter : false
				}
			}

			if(imgsRangTopArr && imgsRangTopArr[0]){
				imgsRangArr.splice(topImgSplicIndex,0,imgsRangTopArr[0])
			}
			imgsRangArr.splice(centerIndex,0,imgsRangCenterArr[0])
			this.setState({
				imgsRangArr : imgsRangArr
			})
			console.log(imgsRangArr,'12312313123')
	}
	componentDidMount (){

		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil( stageW / 2 ), 
			halfStageH = Math.ceil( stageH / 2 );

		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW =  imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);

		//图片居中位置		
		Constant.centerPos = {
			left : halfStageW - halfImgW,
			top : halfStageH - halfImgH
		}

		//图片左侧，右侧区域的范围
		Constant.hPosRange.leftSecX[0] = - halfImgW;
		Constant.hPosRange.leftSecX[0] = halfStageW - halfImgW * 3;
		Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		Constant.hPosRange.y[0] = - halfImgH;
		Constant.hPosRange.y[1] = stageH - halfImgH;

		//图片中上的范围
		Constant.vPosRange.x[0] = halfStageW - halfImgW;
		Constant.vPosRange.x[1] = halfStageW;
		Constant.vPosRange.topY[0] = - halfImgH;
		Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3; 

		this.rearrange(0);
	}
	render() {
		// let sliserNum = [];
		let imagesList = [];
		imagesData.forEach((value,index)=>{

			//将所有图片都定位到了左上角
			if(!this.state.imgsRangArr[index]){
				this.state.imgsRangArr[index] = {
					pos : {
						left : 0 ,
						top : 0
					},
					rotate : 0,
					isInverse : false,
					isCenter : true
				}
			}
			imagesList.push(<ImageBoxComponent data={value} key={index} ref={'imgFigure' + index} arrange={this.state.imgsRangArr[index]} inverse={this.isInverseFun(index)} iscenter={this.isCenterFun(index)}/>);

		});

		return (
			<div className="stage" ref="stage">
				<section className="img-list">
					{imagesList}
				</section>
				<nav className="nav-list"></nav>
			</div>
		);
	}
}

AppComponent.defaultProps = {
};

export default AppComponent;
1