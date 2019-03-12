function renderEntities(ctx, list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(ctx, list[i]);
    }    
}

function renderEntity(ctx, entity) {
    ctx.save();
    ctx.translate(entity.pos.x, entity.pos.y);
    entity.sprite ? entity.sprite.render(ctx) : false;
    ctx.restore();
}