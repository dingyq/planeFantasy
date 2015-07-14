/**
 * Created by bigqiang on 15/6/28.
 */

var TargetSelectCell = cc.TableViewCell.extend({
    _className:"TargetSelectCell",
    sprite:null,
    label:null,
    cellSize:cc.size(110, 100),

    draw:function (ctx) {
        this._super(ctx);
    },

    initWithData:function(config){
        this.sprite = new TargetSprite("#"+config.sprName);
        //this.sprite = new cc.Sprite("#"+config.sprName);
        this.sprite.setSpriteProperty(config.targetType, config.direction, config.rotation, "#"+config.sprName);
        this.sprite.setScale(0.6);
        this.sprite.setRotation(config.rotation);
        //this.sprite.setAnchorPoint(0, 0);
        this.sprite.x = this.cellSize.width/2;
        this.sprite.y = this.cellSize.height/2;
        this.sprite.setTag(122);
        this.addChild(this.sprite);

        //this.edgeSpr = new cc.Sprite(res.targetSelect_png);
        //this.edgeSpr.setScale(0.6);
        //this.edgeSpr.setRotation(config.rotation);
        //this.edgeSpr.x = this.cellSize.width/2;
        //this.edgeSpr.y = this.cellSize.height/2;
        //this.edgeSpr.setVisible(false);
        //this.addChild(this.edgeSpr);

        this.label = new cc.LabelTTF(config.name, "Helvetica", 20.0);
        this.label.x = 0;
        this.label.y = 0;
        this.label.anchorX = 0;
        this.label.anchorY = 0;
        this.label.tag = 123;
        this.addChild(this.label);
    },

    updateWithData:function(config){
        this.sprite.setSpriteProperty(config.targetType, config.direction, config.rotation, "#"+config.sprName);
        cc.log("tst "+config.sprName);

        this.sprite.setRotation(config.rotation);


        //this.edgeSpr.setRotation(config.rotation);
        this.label.setString(config.name);
    },

    displaySelectTip:function(isShow){
        //this.edgeSpr.setVisible(isShow);
    }
});

var targetSelectConfig = [
    {name:"planeUp", direction:DIRECTION.UP, sprName:targetModelRes.plane, rotation:0, targetType:TARGET_TYPE.PLANE},
    {name:"planeDown", direction:DIRECTION.DOWN, sprName:targetModelRes.plane, rotation:180, targetType:TARGET_TYPE.PLANE},
    {name:"planeLeft", direction:DIRECTION.LEFT, sprName:targetModelRes.plane, rotation:270, targetType:TARGET_TYPE.PLANE},
    {name:"planeRight", direction:DIRECTION.RIGHT, sprName:targetModelRes.plane, rotation:90, targetType:TARGET_TYPE.PLANE},
    {name:"tankUp", direction:DIRECTION.UP, sprName:targetModelRes.tank, rotation:0, targetType:TARGET_TYPE.TANK},
    {name:"tankDown", direction:DIRECTION.DOWN, sprName:targetModelRes.tank, rotation:180, targetType:TARGET_TYPE.TANK},
    {name:"tankLeft", direction:DIRECTION.LEFT, sprName:targetModelRes.tank, rotation:270, targetType:TARGET_TYPE.TANK},
    {name:"tankRight", direction:DIRECTION.RIGHT, sprName:targetModelRes.tank, rotation:90, targetType:TARGET_TYPE.TANK},
    {name:"cannonLeft", direction:DIRECTION.UP, sprName:targetModelRes.cannon, rotation:0, targetType:TARGET_TYPE.CANNON},
    {name:"cannonDown", direction:DIRECTION.DOWN, sprName:targetModelRes.cannon, rotation:180, targetType:TARGET_TYPE.CANNON},
    {name:"cannonLeft", direction:DIRECTION.LEFT, sprName:targetModelRes.cannon, rotation:270, targetType:TARGET_TYPE.CANNON},
    {name:"cannonRight", direction:DIRECTION.RIGHT, sprName:targetModelRes.cannon, rotation:90, targetType:TARGET_TYPE.CANNON}
];

var TargetSelectPanel = BaseLayer.extend({
    _className:"TargetSelectPanel",
    selectTableView:null,
    tableViewSize:cc.size(110, 500),
    tableViewCellSize:cc.size(110, 100),

    ctor:function(){
        this._super();
        this.setPosition(0, 0);
        this.setContentSize(cc.winSize);
        //this.setColor(cc.color(255, 255, 0));

        return true;
    },

    onEnter:function(){
        this._super();
        //this.createSelectPanel();
        this.createSelectPanel1();
    },

    onExit:function(){


        this._super();
    },


    createSelectPanel1:function(){
        this.selectPanel = new cc.Layer();
        //this.selectPanel.setColor(cc.color(255,255,0));
        this.selectPanel.setPosition(0,0);
        this.selectPanel.setContentSize(cc.winSize.width, 200);
        for(var i = 0; i < targetSelectConfig.length; i++){
            var config = targetSelectConfig[i];
            this.sprite = new TargetSprite("#"+config.sprName);
            this.sprite.setSpriteProperty(config.targetType, config.direction, config.rotation, "#"+config.sprName);
            this.sprite.setRotation(config.rotation);
            var csize = this.sprite.getContentSize();
            var scale =cc.winSize.width/ (csize.width*targetSelectConfig.length);
            this.sprite.setScale(0.3);
            //this.sprite.setAnchorPoint(0, 0);
            this.sprite.x = csize.width/2*(i+1)+20;
            this.sprite.y = 200/2;
            this.selectPanel.addChild(this.sprite);
        }

        this.addChild(this.selectPanel)
    },

    createSelectPanel:function(){
        this.selectPanel = new cc.TableView(this, this.tableViewSize);
        this.selectPanel.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.selectPanel.x = 10;
        this.selectPanel.y = cc.winSize.height / 2 - 250;
        this.selectPanel.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.selectPanel.setDelegate(this);
        this.addChild(this.selectPanel);
        this.selectPanel.reloadData();
    },

    tableCellAtIndex:function(table, idx){
        var strValue = idx.toFixed(0);
        var cell = table.dequeueCell();
        var config = targetSelectConfig[idx];

        if (!cell) {
            cell = new TargetSelectCell();
            cell.initWithData(config);
        } else {
            cell.updateWithData(config);
        }

        return cell;
    },

    scrollViewDidScroll:function (view) {
        //cc.log("scrollViewDidScroll");

    },

    scrollViewDidZoom:function (view) {
    },

    tableCellTouched:function (table, cell) {
        cc.log("cell touched at index: " + cell.getIdx());
    },

    tableCellSizeForIndex:function (table, idx) {
        //return cc.size(100, 100);
        return this.tableViewCellSize;
    },

    numberOfCellsInTableView:function(table){
        return targetSelectConfig.length;
    }
});