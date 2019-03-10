function renderEntities(ctx, list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(ctx, list[i]);
    }    
}

function renderEntity(ctx, entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}