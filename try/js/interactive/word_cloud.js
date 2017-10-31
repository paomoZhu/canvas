function word_cloud(config)
{
    var _self=this;
    _self.ownerDocument=document;
    _self.ownerWindow=window;
    _self.config=config;

    _self.canvas=_self.ownerDocument.getElementById("word_cloud_canvas");
    _self.canvas.width=_self.config.width;
    _self.canvas.height=_self.config.height;

    _self.ctx=_self.canvas.getContext('2d');
    _self.canvas.style.zIndex=1;

    _self.canvas_temp=_self.ownerDocument.createElement("canvas");
    _self.canvas_temp.width=_self.config.width;
    _self.canvas_temp.height=_self.config.height;
    _self.ctx_temp=_self.canvas_temp.getContext('2d');
    _self.canvas_temp.style.zIndex=0;

    _self.word=[];

    _self.canvas.style.backgroundColor=_self.config.bgcolor;
}

word_cloud.prototype.clear=function()
{
    var _self=this;
    _self.ctx.clearRect(0,0,_self.config.width,_self.config.height);
    _self.ctx_temp.clearRect(0,0,_self.config.width,_self.config.height);
    _self.word=[];
    clearTimeout(_self._timeout);
}

word_cloud.prototype.show=function(data, cb)
{

    var _self=this;
    _self.clear();

    data=data.sort(function(a,b){//按照人工权重 排序 例如文字 : 39  文本  #123456
        return parseInt(b[0])-parseInt(a[0]);
    });
    for(var i=0;i<data.length;i++)
    {
        if(data[i])
        {
            //    ret[0] 权重  后期应该来自权重计算， 这里写死
            var ret=data[i];
            var size=parseInt(ret[0])*_self.config.size_zoom;  //size = 权重 * 放大比例
            var txt=ret[1];
            var color=ret[2];

            if(size<_self.config.min_size)size=_self.config.min_size; // 确定字体最小号
            _self.word.push({
                size:size,
                text:txt,
                color:color
            });
        }
    }

    var pixel=[];

    var midx=Math.floor(_self.config.width/2);
    var midy=Math.floor(_self.config.height/2);
    var step=1;
    var isgoon=true;

    while(isgoon)
    {
        //少个界限判断, 如果不是正方形， 避免多余点（含负值）的遍历
        var leftX =midx-step*_self.config.minstep;  //最小检测范围
        var rightX=midx+step*_self.config.minstep;

        var topY=midy-step*_self.config.minstep;
        var bottomY=midy+step*_self.config.minstep;
        isgoon=false;
        var buff=[];

        if(topY>=0)//上下
        {	//topY 和 bottomY 已定
            for(var i=leftX;i<rightX;i+=_self.config.minstep)
            {
                buff.push([i,topY]);
                buff.push([i,bottomY]);
            }
            isgoon=true;
        }

        if(leftX>=0)//左右
        {
            for(var i=topY;i<bottomY;i+=_self.config.minstep)
            {
                buff.push([rightX,i]);
                buff.push([leftX,i]);
            }
            isgoon=true;
        }

        buff=buff.sort(function(){
            return Math.floor(Math.random()*1000) > 500;
        });

        pixel=pixel.concat(buff);

        step++;
    }

    _self.pixel=pixel;//遍历路径， 一个正方形的珊格


    var curIndex=0;
    var _append=function(){
        if(curIndex<_self.word.length)
        {
            _self.appendWord(_self.word[curIndex]);
            curIndex++;
            _self._timeout=setTimeout(_append,_self.config.speed);
        }else{
            if(cb){ cb();}
        }
    };
    _self._timeout=setTimeout(_append,_self.config.speed);
};

word_cloud.prototype.appendWord=function(objWord){
    var _self=this;

    var r=0;
    if(Math.random()*100<_self.config.rotate_chance)
    {
        r=Math.round(Math.random()*40);
        if(Math.random()*10>5)
            r=0-r;
    }

    var imgdata=_self.ctx.getImageData(0,0,_self.config.width,_self.config.height);
    var wordData=_self.wordPixel(objWord.text,objWord.size,objWord.color,r);
    var width=wordData.width;
    var height=wordData.height;

    var step=Math.round(width/2);

    for(var i=0;i<_self.pixel.length;i+=step)
    {
        //进来一个点
        var x=Math.round(_self.pixel[i][0]-width/2);
        var y=Math.round(_self.pixel[i][1]-height/2);
        var curLine=0;
        var curIndex=0;

        var isfaild=false;

        if(x<0 || y<0 || x+width>_self.config.width || y+height>_self.config.height)
        {
            continue; //超过大canvas
        }

        while(curLine<height+_self.config.spacing)
        {
            //遍历当前行， 直到整个canvas的行被遍历完
            //像素点
            //词间隔
            //cSite 和 tSite 其实是同一个点, 但是这两个点身在两个不同的数组中
            var cSite=((y+curLine)*_self.config.width+x+curIndex)*4;
            var tSite=(curLine*(width)+curIndex)*4;

            if(imgdata.data[cSite]>0 || imgdata.data[cSite+1]>0 || imgdata.data[cSite+2]>0 || imgdata.data[cSite+3]>0)
            {
                if(wordData.data[tSite]>0 || wordData.data[tSite+1]>0 || wordData.data[tSite+2]>0 || wordData.data[tSite+3]>0)
                {
                    //颜色有重叠区域
                    isfaild=true;
                    break;
                }
            }

            curIndex++;
            if(curIndex>=width)
            {
                curLine++;
                curIndex=0;
            }
        }

        if(!isfaild)
        {
            var curData=_self.ctx.createImageData(width,height);

            curLine=0;
            curIndex=0;

            while(curLine<height+_self.config.spacing)
            {
                //某一点的rgba
                var cSite=((y+curLine)*_self.config.width+x+curIndex)*4;
                var tSite=(curLine*(width)+curIndex)*4;

                //确定是不重合的， 所以哪边有颜色填充哪边
                if(imgdata.data[cSite]>0 || imgdata.data[cSite+1]>0 || imgdata.data[cSite+2]>0 || imgdata.data[cSite+3]>0)
                {
                    curData.data[tSite]=imgdata.data[cSite];
                    curData.data[tSite+1]=imgdata.data[cSite+1];
                    curData.data[tSite+2]=imgdata.data[cSite+2];
                    curData.data[tSite+3]=imgdata.data[cSite+3];
                }
                else
                {
                    curData.data[tSite]=wordData.data[tSite];
                    curData.data[tSite+1]=wordData.data[tSite+1];
                    curData.data[tSite+2]=wordData.data[tSite+2];
                    curData.data[tSite+3]=wordData.data[tSite+3];
                }

                curIndex++;
                if(curIndex>=width)
                {
                    curLine++;
                    curIndex=0;
                }
            }

            //整个画布覆盖,
            _self.ctx.putImageData(curData,x,y);
            console.log(x, y)
            break;
        }
    }

    //清除 文字画板中的画布, 以便下个文字绘制
    _self.ctx_temp.clearRect(0,0,_self.config.width,_self.config.height);
};

word_cloud.prototype.MeasureHeight = function(text, bold, font, size)
{
    // This global variable is used to cache repeated calls with the same arguments
    var str = text + ':' + bold + ':' + font + ':' + size;
    if (typeof(__measuretext_cache__) == 'object' && __measuretext_cache__[str]) {
        return __measuretext_cache__[str][1];
    }

    var div = document.createElement('DIV');
    div.innerHTML = text;
    div.style.position = 'absolute';
    div.style.top = '-100px';
    div.style.left = '-100px';
    div.style.fontFamily = font;
    div.style.fontWeight = bold ? 'bold' : 'normal';
    div.style.fontSize = size + 'px';
    document.body.appendChild(div);

    var size = [div.offsetWidth, div.offsetHeight];

    document.body.removeChild(div);

    // Add the sizes to the cache as adding DOM elements is costly and can cause slow downs
    if (typeof(__measuretext_cache__) != 'object') {
        __measuretext_cache__ = [];
    }
    __measuretext_cache__[str] = size;

    return size[1];
}

word_cloud.prototype.wordPixel=function(text,size,color,rotate)
{
        var _self=this;

        if(!color)
        {
            if(_self.config.default_color && _self.config.default_color.length>0)
            {
                var ind=Math.round(Math.random()*_self.config.default_color.length);
                color=_self.config.default_color[ind];
            }
            else
            {
                color="#"+Math.floor((Math.random()*255)).toString(16)+Math.floor((Math.random()*255)).toString(16)+Math.floor((Math.random()*255)).toString(16);
            }
        }

        _self.ctx_temp.textBaseline="top";

        _self.ctx_temp.font= _self.config.default_bold+" "+size+"px "+_self.config.default_family;
        _self.ctx_temp.fillStyle = color;
        _self.ctx_temp.strokeStyle = color;

        var height=_self.MeasureHeight(text, _self.config.default_bold, _self.config.default_family, size)+_self.config.spacing;
        var width=_self.ctx_temp.measureText(text).width+_self.config.spacing;


        if(isNaN(rotate) || rotate==0)
        {
            _self.ctx_temp.fillText(text,0,0);
        }
        else
        {
            function newSize(angle, width, height){
                var newWidth, newHeight;

                if(angle < 0){
//	            console.log(angle);
                    angle += 360;
                }

                if(angle > 0 && angle <= 90){
                    newWidth = Math.cos(Math.PI/180 * angle)*width + Math.sin(Math.PI/180 * angle)*height;
                    newHeight = Math.cos(Math.PI/180 * angle)*height + Math.sin(Math.PI/180 * angle)*width;
                }

                if(angle > 90 && angle < 180){
                    angle = 180 - angle;
                    newWidth = Math.cos(Math.PI/180 * angle)*width + Math.sin(Math.PI/180 * angle)*height;
                    newHeight = Math.cos(Math.PI/180 * angle)*height + Math.sin(Math.PI/180 * angle)*width;
                }

                if(angle >=180 && angle < 270){
                    angle = 270 - angle;
                    newWidth = Math.cos(Math.PI/180 * angle)*width + Math.sin(Math.PI/180 * angle)*height;
                    newHeight = Math.cos(Math.PI/180 * angle)*height + Math.sin(Math.PI/180 * angle)*width;
                }

                if(angle > 270 && angle < 360){
                    angle = 360 - angle;
                    newWidth = Math.cos(Math.PI/180 * angle)*width + Math.sin(Math.PI/180 * angle)*height;
                    newHeight = Math.cos(Math.PI/180 * angle)*height + Math.sin(Math.PI/180 * angle)*width;
                }

                return {
                    width: newWidth,
                    height: newHeight
                }
            }

            var oldRotate = rotate;
            var size = newSize(rotate, width, height);

            var a=Math.round(size.width);
            var b=Math.round(size.height);

            var centerX=Math.round(width/2);
            var centerY=Math.round(height/2);

            _self.ctx_temp.translate(centerX,centerY);
            _self.ctx_temp.rotate((Math.PI / 180) * oldRotate);

            _self.ctx_temp.fillText(text, -centerX + (a/2 - width/2 > 0 ? (a/2 - width/2): 0), -centerY + (b/2 - height/2 > 0 ? (b/2 - height/2): 0));

            _self.ctx_temp.rotate((Math.PI / 180) * (-oldRotate));
            _self.ctx_temp.translate(-centerX,-centerY);

            width = a;
            height = b;
        }

        return _self.ctx_temp.getImageData(0,0,width,height);
    }


/**
 *
 *    word_cloud 组件
 *    show() 方法中data的结构 [['33', 'aaa', '#ffffff'] , [权重, '文字', 'color']];
 *
 *
 *
 *
 *
 *
 *
 *
 *
 * */