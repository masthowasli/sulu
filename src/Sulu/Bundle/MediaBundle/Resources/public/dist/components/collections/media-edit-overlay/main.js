define(["config","./cropping-slide","services/sulumedia/media-manager","services/sulumedia/file-icons","services/sulumedia/image-editor","text!./info.html","text!./copyright.html","text!./versions.html","text!./preview.html","text!./formats.html","text!./categories.html"],function(a,b,c,d,e,f,g,h,i,j,k){"use strict";var l="sulu.media-edit.",m={instanceName:"",startingSlide:"edit"},n={thumbnailFormat:"260x",formSelector:"#media-form",multipleEditFormSelector:"#media-multiple-edit",fileDropzoneSelector:"#file-version-change",previewDropzoneSelector:"#preview-image-change",multipleEditDescSelector:".media-description",multipleEditTagsSelector:".media-tags",descriptionCheckboxSelector:"#show-descriptions",tagsCheckboxSelector:"#show-tags",previewImgSelector:".media-edit-preview-image img",singleEditClass:"single-edit",multiEditClass:"multi-edit",loadingClass:"loading",loaderClass:"media-edit-loader",resetPreviewActionClass:"media-reset-preview-action",singleOverlaySkin:"large",multipleOverlaySkin:"medium"},o=function(a){return"/admin/api/media/"+a+"/preview"},p=function(){return r.call(this,"closed")},q=function(){return r.call(this,"initialized")},r=function(a){return l+(this.options.instanceName?this.options.instanceName+".":"")+a};return{templates:["/admin/media/template/media/multiple-edit"],initialize:function(){if(this.options=this.sandbox.util.extend(!0,{locale:this.sandbox.sulu.getDefaultContentLocale()},m,this.options),!this.options.mediaIds)throw new Error("media-ids are not defined");this.options.previewInitialized=!1,this.media=null,this.medias=null,this.$multiple=null,this.startLoadingOverlay(this.options.mediaIds.length>1),this.loadMedias(this.options.mediaIds,this.options.locale).then(function(a){this.editMedia(a)}.bind(this)),this.sandbox.emit(q.call(this))},startLoadingOverlay:function(a){var b=this.sandbox.dom.createElement('<div class="'+n.loadingClass+'"/>'),c=this.sandbox.dom.createElement('<div class="'+n.loaderClass+'" />');this.sandbox.dom.append(this.$el,b),this.sandbox.once("husky.overlay.media-edit.loading.opened",function(){this.sandbox.start([{name:"loader@husky",options:{el:c,size:"100px",color:"#cccccc"}}])}.bind(this)),this.sandbox.start([{name:"overlay@husky",options:{el:b,title:this.sandbox.translate("sulu.media.edit.loading"),data:c,skin:a?n.multipleOverlaySkin:n.singleOverlaySkin,openOnStart:!0,removeOnClose:!0,instanceName:"media-edit.loading",closeIcon:"",okInactive:!0,propagateEvents:!1}}])},loadMedias:function(a,b){var d=[],e=$.Deferred(),f=[];return a.forEach(function(a){var e=c.loadOrNew(a,b);d.push(e),e.then(function(a){f.push(a)}.bind(this))}.bind(this)),$.when.apply(null,d).then(function(){e.resolve(f)}.bind(this)),e},editMedia:function(a){1===a.length?this.editSingleMedia(a[0]):a.length>1&&this.editMultipleMedia(a)},editSingleMedia:function(a){var b,c,e,l,m,o,p;this.media=a,p=d.getByMimeType(a.mimeType),b=this.sandbox.dom.createElement(_.template(f,{media:this.media,translate:this.sandbox.translate,icon:p,thumbnailFormat:n.thumbnailFormat})),this.removePlaceholderOnImgLoad(b,p),c=this.sandbox.dom.createElement(_.template(g,{media:this.media,translate:this.sandbox.translate})),"image"!==a.type.name&&(l=this.sandbox.dom.createElement(_.template(i,{media:this.media,translate:this.sandbox.translate}))),e=this.sandbox.dom.createElement(_.template(h,{media:this.media,translate:this.sandbox.translate})),m=this.sandbox.dom.createElement(_.template(j,{media:this.media,domain:window.location.protocol+"//"+window.location.host,translate:this.sandbox.translate})),o=this.sandbox.dom.createElement(_.template(k,{categoryLocale:this.options.locale,media:this.media,translate:this.sandbox.translate})),this.startSingleOverlay(b,c,m,e,l,o)},startSingleOverlay:function(a,c,d,e,f,g){var h,i=this.sandbox.dom.createElement('<div class="'+n.singleEditClass+'" id="media-form"/>'),j=0;this.sandbox.dom.append(this.$el,i),this.bindSingleOverlayEvents();var k=[{title:this.sandbox.translate("public.info"),data:a},{title:this.sandbox.translate("sulu.media.licence"),data:c}];f&&k.push({title:this.sandbox.translate("sulu.media.preview-tab"),data:f}),k.push({title:this.sandbox.translate("sulu.media.formats"),data:d}),k.push({title:this.sandbox.translate("sulu.media.categories"),data:g}),k.push({title:this.sandbox.translate("sulu.media.history"),data:e}),"image"===this.media.type.name&&(h=$('<div class="edit-action-select"/>'),b.initialize(this.$el,this.sandbox,this.media,function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",0)}.bind(this)),j="crop"===this.options.startingSlide?1:j),this.sandbox.start([{name:"overlay@husky",options:{el:i,openOnStart:!0,removeOnClose:!0,instanceName:"media-edit",skin:n.singleOverlaySkin,startingSlide:j,supportKeyInput:!1,slides:[{title:this.media.title,subTitle:this.sandbox.util.cropMiddle(this.media.mimeType+", "+this.sandbox.util.formatBytes(this.media.size),32),tabs:k,languageChanger:{locales:this.sandbox.sulu.locales,preSelected:this.options.locale},panelContent:h,propagateEvents:!1,okCallback:this.singleOkCallback.bind(this),cancelCallback:function(){this.sandbox.stop()}.bind(this),buttons:[{type:"cancel",inactive:!1,text:"public.cancel",align:"left"},{classes:"just-text "+n.resetPreviewActionClass,inactive:!1,text:"sulu.media.reset-preview-image",align:"center",callback:function(){return this.resetPreviewImage.call(this),!1}.bind(this)},{type:"ok",inactive:!1,text:"public.ok",align:"right"}]},b.getSlideDefinition()]}}]).then(function(){"image"===this.media.type.name&&(this.startEditActionSelect(h),b.start())}.bind(this))},startEditActionSelect:function(a){var b;b=e.editingIsPossible()?{data:[{name:this.sandbox.translate("sulu-media.crop"),callback:function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",1)}.bind(this)},{name:this.sandbox.translate("sulu-media.edit-original"),callback:function(){this.sandbox.sulu.showConfirmationDialog({title:"sulu-media.external-server-title",description:"sulu-media.external-server-description",callback:function(a){a&&e.editImage(this.media.url).then(this.setNewVersionByUrl.bind(this))}.bind(this)})}.bind(this)}]}:{defaultLabel:this.sandbox.translate("sulu-media.crop"),icon:"crop",noItemsCallback:function(){this.sandbox.emit("husky.overlay.media-edit.slide-to",1)}.bind(this),data:[]},this.sandbox.start([{name:"select@husky",options:this.sandbox.util.extend(!0,{},{el:a,defaultLabel:this.sandbox.translate("sulu-media.edit-image"),instanceName:"edit-action-select",fixedLabel:!0,skin:"white-border",icon:"paint-brush",repeatSelect:!0},b)}])},removePlaceholderOnImgLoad:function(a,b){var c=a.find(n.previewImgSelector);c.length&&(c.hide(),c.load(function(){c.show(),c.parent().removeClass(b)}.bind(this)))},singleOkCallback:function(){return this.sandbox.form.validate(n.formSelector)?(this.saveSingleMedia(),void this.sandbox.stop()):!1},bindSingleOverlayEvents:function(){this.sandbox.once("husky.overlay.media-edit.opened",function(){this.sandbox.form.create(n.formSelector).initialized.then(function(){this.sandbox.form.setData(n.formSelector,this.media).then(function(){this.sandbox.start(n.formSelector),this.sandbox.dom.addClass($("."+n.resetPreviewActionClass),"hide"),this.startSingleDropzone()}.bind(this))}.bind(this))}.bind(this)),this.sandbox.once("husky.overlay.media-edit.initialized",function(){this.sandbox.emit("husky.overlay.media-edit.loading.close")}.bind(this)),this.sandbox.once("husky.overlay.media-edit.opened",function(){this.clipboard=this.sandbox.clipboard.initialize(".fa-clipboard"),this.sandbox.emit("husky.overlay.alert.close")}.bind(this)),this.sandbox.on("husky.tabs.overlaymedia-edit.item.select",function(a){var b=$("."+n.resetPreviewActionClass);"media-preview"===a.$el[0].id?(this.options.previewInitialized||(this.startPreviewDropzone(),this.options.previewInitialized=!0),this.sandbox.dom.removeClass(b,"hide")):this.sandbox.dom.addClass(b,"hide")}.bind(this)),this.sandbox.once("husky.overlay.media-edit.initialized",function(){this.sandbox.emit("husky.overlay.media-edit.loading.close")}.bind(this)),this.sandbox.on("husky.overlay.media-edit.language-changed",this.languageChangedSingle.bind(this)),this.sandbox.dom.on(this.$el,"click",function(a){var b=$(a.currentTarget),c=b.parents(".media-edit-link"),d=b.siblings(".media-edit-copied");c.addClass("highlight-animation"),b.hide(),d.show(),_.delay(function(a,b,c){b.removeClass("highlight-animation"),c.hide(),a.show()},2e3,b,c,d)}.bind(this),".fa-clipboard"),this.sandbox.on("husky.dropzone.file-version.uploading",function(){this.sandbox.emit("husky.overlay.alert.close")}.bind(this)),this.sandbox.on("husky.dropzone.file-version.files-added",this.newVersionUploadedHandler.bind(this)),this.sandbox.on("husky.dropzone.preview-image.files-added",this.previewImageChangeHandler.bind(this))},unbindSingleOverlayEvents:function(){this.sandbox.off("husky.overlay.media-edit.language-changed"),this.sandbox.off("husky.tabs.overlaymedia-edit.item.select"),this.sandbox.off("husky.dropzone.file-version.files-added"),this.sandbox.off("husky.dropzone.preview-image.files-added")},languageChangedSingle:function(a){this.saveSingleMedia().then(function(){b.destroy(),this.sandbox.stop(this.$find("*")),this.options.locale=a,this.unbindSingleOverlayEvents(),this.initialize()}.bind(this))},setNewVersionByUrl:function(a){this.sandbox.sulu.showConfirmationDialog({title:"sulu-media.new-version-will-be-created",description:"sulu-media.new-version-will-be-created-description",callback:function(b){return b?(this.sandbox.emit("husky.overlay.alert.show-loader"),this.sandbox.emit("husky.dropzone.file-version.add-image",a),!1):void 0}.bind(this)})},newVersionUploadedHandler:function(a){a[0]&&(this.sandbox.emit("sulu.medias.media.saved",a[0].id,a[0]),this.sandbox.emit("sulu.labels.success.show","labels.success.media-save-desc"),b.destroy(),this.sandbox.stop(this.$find("*")),this.unbindSingleOverlayEvents(),this.initialize())},previewImageChangeHandler:function(){var a=this.media.id;c.loadOrNew(a,this.options.locale).then(function(a){this.sandbox.emit("sulu.medias.media.saved",a.id,a),this.sandbox.emit("sulu.labels.success.show","labels.success.media-save-desc"),b.destroy(),this.sandbox.stop(this.$find("*")),this.unbindSingleOverlayEvents(),this.initialize()}.bind(this))},saveSingleMedia:function(){var a=$.Deferred();if(this.sandbox.form.validate(n.formSelector)){var b=this.sandbox.form.getData(n.formSelector),d=this.sandbox.util.extend(!1,{},this.media,b);JSON.stringify(this.media)!==JSON.stringify(d)?c.save(d).then(function(){a.resolve()}):a.resolve()}else a.resolve();return a},startSingleDropzone:function(){this.sandbox.start([{name:"dropzone@husky",options:{el:n.fileDropzoneSelector,maxFilesize:a.get("sulu-media").maxFilesize,url:"/admin/api/media/"+this.media.id+"?action=new-version&locale="+this.options.locale,method:"POST",paramName:"fileVersion",showOverlay:!1,skin:"overlay",titleKey:"",descriptionKey:"sulu.media.upload-new-version",instanceName:"file-version",maxFiles:1}}])},startPreviewDropzone:function(){this.sandbox.start([{name:"dropzone@husky",options:{el:n.previewDropzoneSelector,maxFilesize:a.get("sulu-media").maxFilesize,url:"/admin/api/media/"+this.media.id+"/preview",method:"POST",paramName:"previewImage",showOverlay:!1,skin:"overlay",titleKey:"",descriptionKey:"sulu.media.upload-new-preview",instanceName:"preview-image",maxFiles:1}}])},editMultipleMedia:function(a){this.medias=a,this.$multiple=this.sandbox.dom.createElement(this.renderTemplate("/admin/media/template/media/multiple-edit")),this.startMultipleEditOverlay()},startMultipleEditOverlay:function(){var a=this.sandbox.dom.createElement('<div class="'+n.multiEditClass+'"/>');this.sandbox.dom.append(this.$el,a),this.bindMultipleOverlayEvents(),this.sandbox.start([{name:"overlay@husky",options:{el:a,title:this.sandbox.translate("sulu.media.multiple-edit.title"),data:this.$multiple,skin:n.multipleOverlaySkin,languageChanger:{locales:this.sandbox.sulu.locales,preSelected:this.options.locale},openOnStart:!0,removeOnClose:!0,closeIcon:"",instanceName:"media-multiple-edit",propagateEvents:!1,okCallback:this.multipleOkCallback.bind(this),cancelCallback:function(){this.sandbox.stop()}.bind(this)}}])},multipleOkCallback:function(){return this.sandbox.form.validate(n.multipleEditFormSelector)?(this.saveMultipleMedia(),void this.sandbox.stop()):!1},languageChangedMultiple:function(a){this.saveMultipleMedia().then(function(){this.sandbox.stop(this.$find("*")),this.options.locale=a,this.unbindMultipleOverlayEvents(),this.initialize()}.bind(this))},bindMultipleOverlayEvents:function(){this.sandbox.once("husky.overlay.media-multiple-edit.opened",function(){this.sandbox.form.create(n.multipleEditFormSelector).initialized.then(function(){this.sandbox.form.setData(n.multipleEditFormSelector,{records:this.medias}).then(function(){this.sandbox.start(n.multipleEditFormSelector)}.bind(this))}.bind(this))}.bind(this)),this.sandbox.once("husky.overlay.media-multiple-edit.initialized",function(){this.sandbox.emit("husky.overlay.media-edit.loading.close")}.bind(this)),this.sandbox.dom.on(this.sandbox.dom.find(n.descriptionCheckboxSelector,this.$multiple),"change",this.toggleDescriptions.bind(this)),this.sandbox.dom.on(this.sandbox.dom.find(n.tagsCheckboxSelector,this.$multiple),"change",this.toggleTags.bind(this)),this.sandbox.on("husky.overlay.media-multiple-edit.language-changed",this.languageChangedMultiple.bind(this))},unbindMultipleOverlayEvents:function(){this.sandbox.off("husky.overlay.media-multiple-edit.language-changed")},toggleDescriptions:function(){var a=this.sandbox.dom.is(this.sandbox.dom.find(n.descriptionCheckboxSelector,this.$multiple),":checked"),b=this.sandbox.dom.find(n.multipleEditDescSelector,this.$multiple);a===!0?this.sandbox.dom.removeClass(b,"hidden"):this.sandbox.dom.addClass(b,"hidden")},toggleTags:function(){var a=this.sandbox.dom.is(this.sandbox.dom.find(n.tagsCheckboxSelector,this.$multiple),":checked"),b=this.sandbox.dom.find(n.multipleEditTagsSelector,this.$multiple);a===!0?this.sandbox.dom.removeClass(b,"hidden"):this.sandbox.dom.addClass(b,"hidden")},saveMultipleMedia:function(){var a=$.Deferred();if(this.sandbox.form.validate(n.multipleEditFormSelector)){var b=this.sandbox.form.getData(n.multipleEditFormSelector),d=[];this.sandbox.util.foreach(this.medias,function(a,e){var f=this.sandbox.util.extend(!1,{},a,b.records[e]);JSON.stringify(a)!==JSON.stringify(f)&&d.push(c.save(f))}.bind(this)),$.when.apply(null,d).then(function(){a.resolve()}.bind(this))}else a.resolve();return a},resetPreviewImage:function(){var a=this.media.id;$.ajax({url:o(a),type:"DELETE",success:function(){this.previewImageChangeHandler.call(this)}.bind(this)})},destroy:function(){this.sandbox.emit(p.call(this))}}});