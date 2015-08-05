var res = {
    gameHallBg_jpg:"res/common/xiaoxiao.png",
    flare_jpg:"res/common/flare.jpg",
    aaShare_png:"res/common/aa_share.png",

    pieceField_plist:"res/pieceFieldPlist.plist",
    pieceField_png:"res/pieceFieldPlist.png",
    targetModel_plist:"res/targetModelPlist.plist",
    targetModel_png:"res/targetModelPlist.png",
    buttonItem_plist:"res/buttonItemPlist.plist",
    buttonItem_png:"res/buttonItemPlist.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var BtnItemRes = {
    baseBtn:"basic_button_normal.png",
    aboutGame:"about_game.png",
    gameOption:"game_option.png",
    machineMode:"machine_mode.png",
    challengeMode:"challenge_mode.png",
    backHall:"back_hall.png",
    restartGame:"restart_game.png",
}

var PieceFiledRes = {
    default:"piece_default.png",
    fail:"piece_fail.png",
    headHit:"piece_head_hit.png",
    bodyHit:"piece_body_hit.png",
    mark:"piece_mark.png",
    legal:"piece_legal.png",
    illegal:"piece_illegal.png",
};

var TargetModelRes = {
    plane:"plane_model.png",
    tank:"tank_model.png",
    cannon:"cannon_model.png",
    select:"target_select_edge.png",
}
