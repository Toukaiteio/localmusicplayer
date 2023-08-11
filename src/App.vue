<template>
  <!-- <div class="MouseCover"></div> -->
  <div class="FileDealer" @mousemove="MouseMovementHandler" @mouseleave="MouseHideHandler" @dragleave="dragDestoryer" v-show="pageState.is_file_drag_in&&!pageState.is_show_modify_window">
      <input class="_f_loader" type="file" @change="fileImportHandler"/>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M128 64c0-35.3 28.7-64 64-64H352V128c0 17.7 14.3 32 32 32H512V448c0 35.3-28.7 64-64 64H192c-35.3 0-64-28.7-64-64V336H302.1l-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39H128V64zm0 224v48H24c-13.3 0-24-10.7-24-24s10.7-24 24-24H128zM512 128H384V0L512 128z"/></svg>
      <div class="Content">在此处拖入文件</div>
  </div>
  <div class="MousePointerWrapper">
    <div class="mouseItem" v-show="pageState.is_show_cursor"  :style="{left:`${pageState._cursor_pos[0]}px`,top:`${pageState._cursor_pos[1]}px`}">
      <img v-if="pageState._cursor!=''" :src="pageState._cursor">
    </div>
  </div>
  <div class="MainBox LoadingScreen" @mousemove="MouseMovementHandler" @mouseleave="MouseHideHandler" v-if="!pageState.isInitDone">
    <div class="letter-holder">
          <div class="l-1 letter">L</div>
          <div class="l-2 letter">o</div>
          <div class="l-3 letter">a</div>
          <div class="l-4 letter">d</div>
          <div class="l-5 letter">i</div>
          <div class="l-6 letter">n</div>
          <div class="l-7 letter">g</div>
          <div class="l-8 letter">.</div>
          <div class="l-9 letter">.</div>
          <div class="l-10 letter">.</div>
        </div>
  </div>
  <div class="MainBox ShowUp" v-else
        @mousemove="MouseSwipeHandler_SwipeController"
        @mouseup="MouseSwipeHandler_CancelController"
        @mouseleave="MouseSwipeHandler_CancelController"
        @dragenter="dragTrigger"
        @touchmove="MouseSwipeHandler_SwipeController"
        @touchend="MouseSwipeHandler_CancelController"
        @contextmenu.prevent :style="{background:'lightgray'}">

    <div class="MusicWrapper" @mousemove="MouseMovementHandler" @mouseleave="MouseHideHandler">
      <div class="PopupWindowModifyWrapper" v-if="pageState.is_show_modify_window">
        <div class="PopupWindowModify">
          <div class="title">
            <div class="content">添加音乐</div>
            <div class="close" @click="closePW"><svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></div>
          </div>
          <div class="window">
            <div class="pw_item_container">
              <div class="pw_left pw_item">
                <div class="pw_inputer_item">
                  <div class="pw_ii_title">
                    <div class="content">
                      标题:
                    </div>
                  </div>
                  <div class="inputer">
                    <input type="text" v-model="pageState.modify_song_data_bucket.title" />
                  </div>
                </div>
                <div class="pw_inputer_item">
                  <div class="pw_ii_title">
                    <div class="content">
                      歌手:
                    </div>
                  </div>
                  <div class="inputer">
                    <input type="text" v-model="pageState.modify_song_data_bucket.singer"/>
                  </div>
                </div>
                <div class="pw_inputer_item">
                  <div class="pw_ii_title">
                    <div class="content">
                      专辑:
                    </div>
                  </div>
                  <div class="inputer">
                    <input type="text" v-model="pageState.modify_song_data_bucket.album"/>
                  </div>
                </div>
                <div class="pw_inputer_item alert" v-show="pageState.is_find_same">
                  <div class="content">似乎在歌单中存在一首相同歌曲!</div>
                </div>
              </div>

              <div class="pw_right pw_item">
                <div class="inputer_cover_display">
                  <img :src="pageState.modify_song_data_bucket.cover">
                </div>
                <div class="hint">Drag image in ~</div>
                <div class="inputer_cover" v-show="pageState.is_show_modify_image_importer">
                  <input type="file" @change="coverImportHandler">
                </div>
              </div>
            </div>
            <div class="function_btns" v-if="!pageState.is_on_working">
              <div class="placeHolder"></div>
              <div class="btns_Container">
                <div class="pw_btn">
                  <div class="content" @click="saveData">确定</div></div>
                <div class="pw_btn">
                  <div class="content" @click="closePW">取消</div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="Mitem left">
        <div class="top_left_item">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
        </div>
      </div>
      <div class="Mitem mid"  @mousedown="MouseSwipeHandler_StartController" @touchstart="MouseSwipeHandler_StartController" @wheel="MouseScrollHandler" >
        <!-- #_T_OBJ mid -->
        <div class="top_item"
        @mouseup="MouseSwipeHandler_CancelController">
          <div class="subitem sleft">
            <div class="title">
              排序方式
            </div>
            <div class="method">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-sort-up-alt" viewBox="0 0 16 16">
                <path d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
              </svg>
              <div class="content">
                默认
              </div>
            </div>
          </div>
          <div class="subitem sright">
            <div class="ssitem ssl">
              <div class="random_icon">
                <div class="_1"> &lt; </div>
                <div class="_2"> ? </div>
                <div class="_3"> &gt; </div>
              </div>
              <div class="title">
                随机
              </div>
            </div>
            <div class="ssitem_divider"></div>
            <div class="ssitem ssr">
              <div class="setting_icon">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
                </svg>
              </div>
              <div class="title">
                设置
              </div>
            </div>
          </div>
        </div>
        <div class="middle_item nocontent" v-if="pageState.songList.length==0">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-box-arrow-in-up-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M9.636 13.5a.5.5 0 0 1-.5.5H2.5A1.5 1.5 0 0 1 1 12.5v-10A1.5 1.5 0 0 1 2.5 1h10A1.5 1.5 0 0 1 14 2.5v6.636a.5.5 0 0 1-1 0V2.5a.5.5 0 0 0-.5-.5h-10a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h6.636a.5.5 0 0 1 .5.5z"/>
            <path fill-rule="evenodd" d="M5 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1H6.707l8.147 8.146a.5.5 0 0 1-.708.708L6 6.707V10.5a.5.5 0 0 1-1 0v-5z"/>
          </svg>
          <div class="Content">
            Drag File In :)
          </div>
        </div>
        <div class="middle_item" v-else :style="{top:`${pageState.list_top}px`}">
          <div class="list_item" v-for="(_item,_index) in pageState.songList" @click="goByIndex(_index)" :key="'si'+_index">
            <div class="item_left">
              <div class="title">{{ _item.title }}</div>
              <div class="singer">{{ _item.singer }}</div>
            </div> 
            <div class="item_right">
              <div class="player">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="transparent_holder"></div>
        </div>
        <div class="selected_item" v-if="pageState.songList.length!=0">
            <div class="item_left">
              <div class="title">{{pageState.songList[pageState.now_index].title}}</div>
              <div class="singer">{{pageState.songList[pageState.now_index].singer}}</div>
            </div>
            <div class="item_right" v-if="!pageState.isSongPlaying" @click="song_play();">
              <div class="player">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
              </div>
            </div>
            <div class="item_right paused" v-else @click="song_pause();">
              <div class="player">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
              </div>
            </div>
          </div>
      </div>
      <div class="Mitem right">
        <div class="CoverDisplayer">
          <div class="SwipeCoverWrapper" :style="{top:`${pageState.cover_top}px`}" v-if="pageState.songList.length!=0">
            <div class="SwipeCoverItem" v-for="(i_item,i_index) in pageState.songList" :key="'i_'+i_index">
              <img :src="i_item.cover">
            </div>
            
          </div>
          <div class="SwipeItemEffectCoverWrapper">
              <canvas id="s_canvas_el" class="SwipeItemEffectCover">

              </canvas>
            </div>
          <div class="SwipeCoverWrapper" v-if="pageState.songList.length==0">
            <div class="SwipeCoverItem">
              <div class="AttentionCover">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C120.5 112.3 128 119.9 128 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C119.5 47.7 112 40.1 112 24c0-13.3-10.7-24-24-24zM32 192c-17.7 0-32 14.3-32 32V416c0 53 43 96 96 96H288c53 0 96-43 96-96h16c61.9 0 112-50.1 112-112s-50.1-112-112-112H352 32zm352 64h16c26.5 0 48 21.5 48 48s-21.5 48-48 48H384V256zM224 24c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C232.5 112.3 240 119.9 240 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C231.5 47.7 224 40.1 224 24z"/></svg>
                <div class="slogan">Enjoy your life.</div>
              </div>
            </div>
          </div>
        </div>
        <div class="ControlBar">
          <div class="cb_item double wb">
            <div class="content _l">#</div>
            <div class="content _r">#</div>
          </div>
          <div class="cb_item longer">
            <div class="content">#</div>
          </div>
          <div class="cb_item wb">
            <div class="content">#</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import _parser, { parseV1Tag, parseV2Tag } from 'id3-parser';
import _cursor_arrow from './assets/arrow.gif'
import _cursor_working from './assets/working.gif'
const LIST_KEY="ALLImportList"
// const mmb=require('music-metadata-browser')

// TO DO LIST：
// Music Play on CANVAS
// Music Data Save in IndexedDB
// More Accurate Check Same Song
const BASEMENT_START=186;
const BASEMENT_HEIGHT=95;
const BASEMENT_HEIGHT_COVER=505;
const pageState=reactive({
  list_top:BASEMENT_START,
  cover_top:0, //5.31 * list_top
  move_up_event_id:-1,
  now_index:0,
  last_direction:-1,
  swipe_start_y:-1,
  swipe_start_timestamp:-1,
  swipe_ori_start_y:-1,
  now_mouse_y:-1,
  is_swipe_end:false,
  songList:[],
  is_swipe_command_waiting:false,
  is_swipe_cancel:false,
  is_file_drag_in:false,
  is_show_modify_window:false,
  is_show_modify_image_importer:false,
  is_on_working:false,
  is_find_same:false,
  isDBReady:false,
  isInitDone:false,
  isSongPlaying:false,
  canvas_el:null,
  _ctx:null,
  _now_playing:null,
  // _audio_context:null, new AudioContext
  _cursor:_cursor_working,
  _cursor_pos:[0,0],
  modify_song_data_bucket:{
    title:"",
    cover:"",
    singer:"",
    album:"",
    _h_src:"",
    _h_filename:"",
    _h_cover_u8a:[],
    _h_cover_mime:"",
    _h_song_u8a:[],
    _h_song_mime:"",
    _h_song_size:0,
    _h_song_bucket_id:"",
  },
  is_show_cursor:true,
})
const dragTrigger=(e)=>{
  if(typeof e["dataTransfer"]["files"] != "undefined"){
    pageState.is_file_drag_in=true;
    pageState.is_show_modify_image_importer=true;
    // console.log(e);
  }
}
const dragDestoryer=()=>{
  pageState.is_file_drag_in=false;
  pageState.is_show_modify_image_importer=false;
}

// async function loadArrowAssets(imageUrl) {
//     return new Promise((resolve, reject) => {
//       let canvas = document.createElement('canvas')
//       const ctx = canvas.getContext('2d')
//       let img = new Image()
//       img.crossOrigin = 'Anonymous'
//       img.src = imageUrl
//       img.onload = function() {
//         canvas.height = img.height
//         canvas.width = img.width
//         ctx.drawImage(img, 0, 0)
//         const dataURL = canvas.toDataURL('image/gif', 1)
//         resolve(dataURL)
//         canvas = null
//         img = null
//       }
//       img.onerror = function() {
//         reject(new Error('Could not load image at ' + imageUrl))
//       }
//     })
// }
const songDataResolver_init=(data)=>{
  //title singer album cover src
  const _t_result={}
  _t_result["title"]=data["title"];
  _t_result["singer"]=data["singer"];
  _t_result["album"]=data["album"];
  _t_result["cover"]=URL.createObjectURL(new Blob([data["_h_cover_u8a"]],{type: data["_h_cover_mime"]}))
  _t_result["src"]=URL.createObjectURL(new Blob([data["_h_song_u8a"]],{type: data["_h_song_mime"]}))
  return _t_result;
}
const Init_Common=()=>{
  //SetCursor
  pageState._cursor=_cursor_arrow;
  //LoadMusicList
  const _t_sl=localStorage.getItem(LIST_KEY);
  if(_t_sl==null){
    localStorage.setItem(LIST_KEY,"[]")
  }else{
    for(let __i__ of JSON.parse(_t_sl)){
      _DB.DBStorage_getItem(__i__,(_v)=>{
        const _t_sd=songDataResolver_init(_v);
        pageState.songList.push(_t_sd);
      })
    }
  }



  //LoadMusicResource
  //LoadLastPlayed
  //LoadPlayerSetting
  pageState.isInitDone=true;
}
const _DB={
  indexedDBTarget:null,
  store_init(){
      const request = indexedDB.open("musicDatas", 1);
      request.onupgradeneeded = (event) => {
        if(!pageState.isDBReady){
          const db = event.target.result;
          db.createObjectStore("Musics", { keyPath: "id" });
          pageState.isDBReady=true;
          this.indexedDBTarget=db;
          Init_Common();
        }
      };
      request.onsuccess=(event)=>{
        if(!pageState.isDBReady){
          pageState.isDBReady=true;
          this.indexedDBTarget=event.target.result;
          Init_Common();
        }
      }
    },
    DBStorage_setItem(key,value){
      const transaction = this.indexedDBTarget.transaction("Musics", "readwrite");
      const objectStore = transaction.objectStore("Musics");
      const imageObj = { id: key, ...value };
      objectStore.add(imageObj);
    },
    DBStorage_updateItem(key,value){
      const transaction = this.indexedDBTarget.transaction("Musics", "readwrite");
      const objectStore = transaction.objectStore("Musics");
      const imageObj = { id: key, ...value };
      objectStore.put(imageObj);
    },
    DBStorage_getItem(key,callBack){
      const transaction = this.indexedDBTarget.transaction("Musics", "readonly");
      const objectStore = transaction.objectStore("Musics");
      const getUserRequest = objectStore.get(key);
      getUserRequest.onsuccess=()=>{
        callBack(getUserRequest.result);
      }
    },
    DBStorage_removeItem(key){
      const transaction = this.indexedDBTarget.transaction("Musics", "readwrite");
      const objectStore = transaction.objectStore("Musics");
      objectStore.delete(key);
    }
}
_DB.store_init();
const commonBeforeClosePW=()=>{
  pageState.is_file_drag_in=false;
  pageState.is_show_modify_image_importer=false;
  pageState.is_show_modify_window=false;
  pageState.is_on_working=false;
  pageState.is_find_same=false;
}
const song_play=()=>{
  if(pageState.canvas_el==null){
    pageState.canvas_el=document.getElementById("s_canvas_el");
    pageState._ctx=pageState.canvas_el.getContext("2d");
  }
  if(pageState._now_playing==null){
    const _t_cs=pageState.songList[pageState.now_index];
    const audio=new Audio(_t_cs.src);
    pageState._now_playing=audio;
  }

  pageState._now_playing.play();
  if(pageState._now_playing.onended==null){
    pageState._now_playing.onended=()=>{
      pageState._now_playing.duration=0;
      song_pause();
    }
  }
  pageState.isSongPlaying=true;
}
const song_pause=()=>{
  if(pageState._now_playing!=null){
    pageState._now_playing.pause();
    pageState.isSongPlaying=false;
  }
}
const closePW=()=>{
  commonBeforeClosePW();
  pageState.modify_song_data_bucket={
    title:"",
    cover:"",
    singer:"",
    album:"",
    _h_src:"",
    _h_filename:"",
    _h_cover_u8a:[],
    _h_cover_mime:"",
    _h_song_u8a:[],
    _h_song_mime:"",
  }
}
const saveData=()=>{
  pageState.is_on_working=true;
  pageState.songList.push({
    title:pageState.modify_song_data_bucket.title,
    cover:pageState.modify_song_data_bucket.cover,
    album:pageState.modify_song_data_bucket.album,
    singer:pageState.modify_song_data_bucket.singer,
    src:pageState.modify_song_data_bucket._h_src
  });
  const _t_l=localStorage.getItem(LIST_KEY)
  if(_t_l!=null){
    if(_t_l.indexOf(pageState.modify_song_data_bucket._h_song_bucket_id)!=-1){
      pageState.modify_song_data_bucket._h_song_bucket_id+=`_${new Date().getTime()}`;
    }
  }
  let _t_l_a=JSON.parse(_t_l);
  _t_l_a.push(pageState.modify_song_data_bucket._h_song_bucket_id);
  localStorage.setItem(LIST_KEY,JSON.stringify(_t_l_a));
  // _h_src cover _h_song_bucket_id
  let _total_cost=localStorage.getItem("cachedTotal");
  if(_total_cost==null){
    localStorage.setItem("cachedTotal",pageState.modify_song_data_bucket._h_song_size);
  }else{
    localStorage.setItem("cachedTotal",parseInt(_total_cost)+pageState.modify_song_data_bucket._h_song_size);
  }
  _DB.DBStorage_setItem(pageState.modify_song_data_bucket._h_song_bucket_id,{
    title:pageState.modify_song_data_bucket.title,
    singer:pageState.modify_song_data_bucket.singer,
    album:pageState.modify_song_data_bucket.album,
    _h_filename:pageState.modify_song_data_bucket._h_filename,
    _h_cover_u8a:pageState.modify_song_data_bucket._h_cover_u8a,
    _h_cover_mime:pageState.modify_song_data_bucket._h_cover_mime,
    _h_song_u8a:pageState.modify_song_data_bucket._h_song_u8a,
    _h_song_mime:pageState.modify_song_data_bucket._h_song_mime,
    _h_song_size:pageState.modify_song_data_bucket._h_song_size,
  });
  closePW();
}
const MouseMovementHandler=(e)=>{
  // console.log(e);
  pageState.is_show_cursor=true;
  pageState._cursor_pos[0]=e.pageX;
  pageState._cursor_pos[1]=e.pageY;
}
const MouseHideHandler=()=>{
  pageState.is_show_cursor=false;
}

const songDataResolver=(data)=>{
  pageState.modify_song_data_bucket["title"]=data["title"];
  pageState.modify_song_data_bucket["singer"]=data["singer"];
  pageState.modify_song_data_bucket["album"]=data["album"];
  pageState.modify_song_data_bucket["_h_src"]=data["src"];
  pageState.modify_song_data_bucket["_h_song_u8a"]=data["song_u8a"];
  pageState.modify_song_data_bucket["_h_song_mime"]=data["song_mime"];
  if(data["cover_u8a"].length!=0){
    pageState.modify_song_data_bucket["cover"]=URL.createObjectURL(new Blob([data["cover_u8a"]],{type: data["cover_mime"]}))
    pageState.modify_song_data_bucket["_h_cover_u8a"]=data["cover_u8a"];
    pageState.modify_song_data_bucket["_h_cover_mime"]=data["cover_mime"];
  }else{
    pageState.modify_song_data_bucket["cover"]="";
  }
  pageState.modify_song_data_bucket["title"]=data["title"];
  pageState.modify_song_data_bucket["_h_filename"]=data["filename"];
  pageState.modify_song_data_bucket["_h_song_size"]=data["filesize"];
  pageState.is_show_modify_window=true;
  pageState.is_show_modify_image_importer=false;
  const _t_l=localStorage.getItem(LIST_KEY)
  const resource_bucket_id=`${pageState.modify_song_data_bucket._h_song_size}_${pageState.modify_song_data_bucket._h_song_mime}`;
  pageState.modify_song_data_bucket["_h_song_bucket_id"]=resource_bucket_id;
  if(_t_l!=null){
    if(_t_l.indexOf(resource_bucket_id)!=-1){
      pageState.is_find_same=true;
    }
  }
}
const coverImportHandler=(e)=>{
  const _tFR=new FileReader();
  _tFR.readAsBinaryString(e.target.files[0]);
  _tFR.onload=(E)=>{
    const data=E.target.result
    const mime = e.target.files[0].type;
    if(mime.indexOf("image")==-1){
      alert("Not Support!");
      return;
    }
    let ia = new Uint8Array(data.length)
    for (var i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i)
    }
    const _t_blob=new Blob([ia], {type: mime});
    const _t_URL=URL.createObjectURL(_t_blob);
    pageState.modify_song_data_bucket.cover=_t_URL;
    pageState.modify_song_data_bucket._h_cover_mime=mime;
    pageState.modify_song_data_bucket._h_cover_u8a=ia;
  }
  e.target.value='';
}
const fileImportHandler=(e)=>{
  
  const _tFR=new FileReader();
  _tFR.readAsBinaryString(e.target.files[0]);
  _tFR.onload=(E)=>{
    const data=E.target.result
    // console.log(E);
    const mime = e.target.files[0].type;
    if(mime.indexOf("audio")==-1){
      alert("Not Support!");
      pageState.is_file_drag_in=false;
      return;
    }
    let ia = new Uint8Array(data.length)
    for (var i = 0; i < data.length; i++) {
      ia[i] = data.charCodeAt(i)
    }
    const _t_blob=new Blob([ia], {type: mime});
    const _t_URL=URL.createObjectURL(_t_blob);
    const _t_parser_r=_parser(ia)|| parseV1Tag(ia) || parseV2Tag(ia) ||{};

    if(typeof _t_parser_r["image"]=="undefined"){
      _t_parser_r["image"]={"data":[],"mime":""};
    }
    
    const _t_f_obj={
      "title":_t_parser_r["title"] || e.target.files[0].name,
      "cover_u8a":_t_parser_r["image"]["data"] || [],
      "cover_mime":_t_parser_r["image"]["mime"] || "",
      "singer":_t_parser_r["artist"] || "",
      "album":_t_parser_r["album"] || "",
      "src":_t_URL,
      "song_u8a":ia,
      "song_mime":mime,
      "filename":e.target.files[0].name,
      "filesize":E.total
    }
    for(let __i__ of pageState.songList){
      if(__i__.title.indexOf(e.target.files[0].name.split('.')[0])!=-1){
        pageState.is_find_same=true;
      }
      if(_t_parser_r["title"]){
        if(__i__.title.indexOf(_t_parser_r["title"])!=-1){
          pageState.is_find_same=true;
        }
      }
    }
    e.target.value='';
    songDataResolver(_t_f_obj)
    
    // console.log(_t_f_obj);
  }
  
  
  
  // console.log(e);
}
// const getNearest=(posY)=>{
//   const GAP=BASEMENT_HEIGHT;
//   const HALFGAP=Math.round(GAP/2);
//   const INIAIL=BASEMENT_START;
//   const END=INIAIL-GAP*(pageState.songList.length-1);
//   const MOD=(posY-INIAIL)%GAP;
//   if(posY>INIAIL){
//     return INIAIL;
//   }
//   if(posY<END || posY+MOD < END){
//     return END;
//   }
//   if(MOD<=HALFGAP){
//     return posY-MOD;
//   }else{
//     return posY+MOD;
//   }
// }
// const getNearest_cover=(posY)=>{
//   const GAP=BASEMENT_HEIGHT_COVER;
//   const HALFGAP=Math.round(GAP/2);
//   const INIAIL=0;
//   const END=INIAIL-GAP*(pageState.songList.length-1);
//   const MOD=(posY-INIAIL)%GAP;
//   if(posY>INIAIL){
//     return INIAIL;
//   }
//   if(posY<END || posY+MOD < END){
//     return END;
//   }
//   if(MOD<=HALFGAP){
//     return posY-MOD;
//   }else{
//     return posY+MOD;
//   }
// }
// const attachToNearest=()=>{
//   const posY=pageState.list_top;
//   const NEAREST=getNearest(posY);
//   if(pageState.move_up_event_id!=-1){
//     clearInterval(pageState.move_up_event_id);
//     pageState.move_up_event_id=-1;
//     pageState.is_swipe_end=true;
//   }
//   if(NEAREST>posY){
//     pageState.move_up_event_id=setInterval(()=>{
//       if(NEAREST-pageState.list_top>35){
//         pageState.list_top+=20;
//       }else{
//         if(NEAREST-pageState.list_top>10){
//           pageState.list_top+=5;
//         }else{
//           pageState.list_top+=1;
//         }
//       }
//       if(NEAREST==pageState.list_top){
//         const _t=pageState.move_up_event_id;
//         pageState.move_up_event_id=-1;
//         pageState.now_index=(NEAREST-BASEMENT_START)/BASEMENT_HEIGHT;
//         clearInterval(_t);
//       }
//     },10)
//   }else{
//     pageState.move_up_event_id=setInterval(()=>{
//       if(pageState.list_top-NEAREST>35){
//         pageState.list_top-=20;
//       }else{
//         if(pageState.list_top-NEAREST>10){
//           pageState.list_top-=5;
//         }else{
//           pageState.list_top-=1;
//         }
//       }
//       if(NEAREST==pageState.list_top){
//         const _t=pageState.move_up_event_id;
//         pageState.move_up_event_id=-1;
//         clearInterval(_t);
//       }
//     },10)
//   }
// }
const goByIndex=(index)=>{
  if(pageState.move_up_event_id!=-1){
    clearInterval(pageState.move_up_event_id);
    pageState.move_up_event_id=-1;
    pageState.is_swipe_end=true;
  }
  const _target=BASEMENT_START-index*BASEMENT_HEIGHT;
  const _target_cover=-index*BASEMENT_HEIGHT_COVER;
  if(_target<pageState.list_top){
    pageState.last_direction=1;
    pageState.move_up_event_id=setInterval(()=>{
      if(pageState.list_top>_target){
        if(pageState.list_top-_target>5){
          pageState.list_top-=2;
        }else{
          pageState.list_top-=1;
        }
        if(Math.abs(pageState.cover_top-_target_cover)<8){
            pageState.cover_top=_target_cover
          }else{
            if(Math.abs(pageState.cover_top-_target_cover)>25){
              pageState.cover_top-=20;
            }else{
              pageState.cover_top-=5;
            }
            
          }
      }else{
        pageState.now_index=index;
        let _t=pageState.move_up_event_id;
        pageState.move_up_event_id=-1;
        pageState.last_direction=-1
        clearInterval(_t);
      }
    },1)
  }else{
    pageState.last_direction=0;
    pageState.move_up_event_id=setInterval(()=>{
      if(pageState.list_top<_target){
        if(_target-pageState.list_top>5){
          pageState.list_top+=2;
        }else{
          pageState.list_top+=1;
        }
      if(Math.abs(pageState.cover_top-_target_cover)<8){
            pageState.cover_top=_target_cover
          }else{
            if(Math.abs(pageState.cover_top-_target_cover)>25){
              pageState.cover_top+=20;
            }else{
              pageState.cover_top+=5;
            }
            
          }
      }else{
        pageState.now_index=index;
        let _t=pageState.move_up_event_id;
        pageState.move_up_event_id=-1;
        pageState.last_direction=-1
        clearInterval(_t);
      }
    },1)
  }
}
const MouseScrollHandler=(e)=>{
  e.preventDefault();
  if(e.deltaY>0){ // scroll down - 1
    // console.log(pageState.last_direction)
    if(pageState.last_direction==0){
      let _t=pageState.move_up_event_id;
      pageState.move_up_event_id=-1;
      pageState.last_direction=-1
      pageState.is_swipe_end=true;
      clearInterval(_t);
      goByIndex(pageState.now_index);
      return;
    }
    if(pageState.move_up_event_id==-1){
      const _target=pageState.list_top-BASEMENT_HEIGHT;
      const _target_cover=pageState.cover_top-BASEMENT_HEIGHT_COVER;
      // console.log(pageState.now_index+1==pageState.songList.length)
      if(pageState.now_index+1==pageState.songList.length){
        return;
      }
      pageState.last_direction=1;
      pageState.move_up_event_id=setInterval(()=>{
        if(pageState.list_top>_target){
          pageState.list_top-=1;
          if(Math.abs(pageState.cover_top-_target_cover)<8){
            pageState.cover_top=_target_cover
          }else{
            pageState.cover_top-=5;
          }
        }else{
          pageState.now_index+=1;
          let _t=pageState.move_up_event_id;
          pageState.move_up_event_id=-1;
          pageState.last_direction=-1;
          pageState.is_swipe_end=true;
          clearInterval(_t);
        }
      },2)
    }
  }else{
    // console.log(pageState.last_direction)
    if(pageState.last_direction==1){
      let _t=pageState.move_up_event_id;
      pageState.move_up_event_id=-1;
      pageState.last_direction=-1
      pageState.is_swipe_end=true;
      clearInterval(_t);
      goByIndex(pageState.now_index);
      return; //pause scrolling
    }
      if(pageState.move_up_event_id==-1){ // scroll up - 0
        const _target=pageState.list_top+BASEMENT_HEIGHT;
        const _target_cover=pageState.cover_top+BASEMENT_HEIGHT_COVER;
        if(pageState.now_index==0){
          return;
        }
        pageState.move_up_event_id=setInterval(()=>{
          if(pageState.list_top<_target){
            pageState.list_top+=1;
            if(Math.abs(pageState.cover_top-_target_cover)<8){
              pageState.cover_top=_target_cover
            }else{
              pageState.cover_top+=5;
            }
          }else{
            pageState.now_index-=1;
            let _t=pageState.move_up_event_id;
            pageState.move_up_event_id=-1;
            pageState.last_direction=-1
            pageState.is_swipe_end=true;
            clearInterval(_t);
          }
        },5)
      }
    }
    // console.log(e);
}
const KeepSwipeWithDecreasingSpeed=(speed)=>{
  let _t_counter=1;
  const _sIndex=pageState.now_index;
  let sum=0;
  pageState.move_up_event_id=setInterval(()=>{
    let _t_num=_sIndex-Math.round((sum*2)/BASEMENT_HEIGHT);
    if(_t_num<0 || _t_num>=pageState.songList.length){
      if(_t_num<0){
        _t_num=0;
      }else{
        _t_num=pageState.songList.length-1;
      }
      if(speed>2){
        speed=2;
      }else if(speed < -2){
        speed=-2;
      }
      
    }
    
    if(_t_counter%2==0){
      if(speed<0){
        speed+=1;
      }else if(speed>0){
        speed-=1;
      }
      if(speed==0){
        clearInterval(pageState.move_up_event_id);
        pageState.move_up_event_id=-1;
        pageState.last_direction=-1;
        goByIndex(_t_num);
      }else{
        pageState.list_top+=speed;
        pageState.cover_top+=Math.round(speed*5.31)
        sum+=speed;
      }
    }else{
      pageState.list_top+=speed;
      pageState.cover_top+=Math.round(speed*5.31)
      sum+=speed;
    }
    console.log(_t_num,_t_counter,speed);
    _t_counter+=1;
  },5)
}
const MouseSwipeHandler_StartController=(e)=>{
  if(!pageState.is_swipe_command_waiting){
  pageState.is_swipe_cancel=false;
  setTimeout(()=>{
    // console.log(e.button,pageState.is_swipe_cancel);
    if(e.button==0&&!pageState.is_swipe_cancel){
    if(pageState.move_up_event_id!=-1){
      clearInterval(pageState.move_up_event_id);
      pageState.move_up_event_id=-1;
      pageState.last_direction=-1;
    }
    pageState.swipe_start_timestamp=new Date().getTime();
    pageState.swipe_start_y=e.clientY;
    pageState.swipe_ori_start_y=e.clientY;
    pageState.is_swipe_end=false;
    let sum=0;
    const _sIndex=pageState.now_index;
    pageState.move_up_event_id=setInterval(()=>{
      if(!pageState.is_swipe_end){
        const nowMY=pageState.now_mouse_y;
        let _target=(nowMY-pageState.swipe_start_y)/2;
        if((_target<0) || (_target>0)){
            // alert(`${pageState.now_index},${Math.round(_target/BASEMENT_HEIGHT)}`)
            const _t_num=_sIndex-Math.round((sum*2)/BASEMENT_HEIGHT);
            // console.log(sum,BASEMENT_START-pageState.list_top,BASEMENT_HEIGHT,sum/BASEMENT_HEIGHT,Math.round(sum/BASEMENT_HEIGHT),_target,BASEMENT_START);
            if(_t_num<0 || _t_num>=pageState.songList.length){
              _target/=3;
              if(_t_num<0){
                pageState.now_index=0;
                sum+=_target
                pageState.swipe_start_y=nowMY;
              }else{
                pageState.now_index=pageState.songList.length-1;
                sum+=_target
                pageState.swipe_start_y=nowMY;
              }
              pageState.list_top+=_target;
              pageState.cover_top+=_target*5.31;
            }else{
              pageState.now_index=_t_num;
              pageState.list_top+=_target;
              pageState.cover_top+=_target*5.31;
              if(_target<0) {pageState.last_direction=1;} else {pageState.last_direction=0;} // hold event direction;
              pageState.swipe_start_y=nowMY;
              sum+=_target
              pageState.list_top+=_target;
              pageState.cover_top+=_target*5.31;
              // console.log(sum,_target,pageState.swipe_start_y,_t_num);
            }
            // console.log(pageState.cover_top);
          }
      }
    },20)
    
  }
  pageState.is_swipe_command_waiting=false;
  },80)
  pageState.is_swipe_command_waiting=true;
}
  
}
const MouseSwipeHandler_SwipeController=(e)=>{
  // two mode - Holding left button (absolute) / Release left button (calc speed)
  if(!pageState.is_swipe_end){
    pageState.now_mouse_y=e.clientY;
  }
  // console.log(e);
}
const MouseSwipeHandler_CancelController=(e)=>{
  pageState.is_swipe_cancel=true;
  pageState.is_swipe_command_waiting=false;
  if(e.button==0){
    if(!pageState.is_swipe_end){
      pageState.now_mouse_y=e.clientY;
      pageState.is_swipe_end=true;
      clearInterval(pageState.move_up_event_id);
      pageState.move_up_event_id=-1;
      pageState.last_direction=-1;
      const nowMY=pageState.now_mouse_y;
      const _target=(nowMY-pageState.swipe_ori_start_y)/2;
      const _t_speed=-Math.ceil(_target/(pageState.swipe_start_timestamp-(new Date().getTime())))*3;
      // console.log("Released",_t_speed);
      if(Math.abs(_t_speed)<5){
        goByIndex(pageState.now_index);
      }else{
        KeepSwipeWithDecreasingSpeed(_t_speed);
      }
      
      
    }
  }
}
</script>
<style lang="scss">
$generalAngle:skewX(-15deg);
$generalContentAngle:skewX(15deg);
$generalWhite:#FFFEFF;
$generalTranparentWhite:#fffeff1e;
$generalLightenerWhite:#9e9d9d;
$generalLightenWhite:#ebebeb;
$generalUnactiveWhite:#fffeff51;
$generalDark:#000000;
$generalCover:#0000001a;
$generalLessDarkenCover:#00000058;
$generalDarkenCover:#000000a9;
$generalAlertRed:rgba(249, 88, 88, 0.566);
$generalFontFamily:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
.MousePointerWrapper{
  position: absolute;
  top: 0;
  left: 0;
  // pointer-events: none;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  pointer-events: none;
  z-index: 101;
  overflow: hidden;
  .mouseItem{
    height: 45px;
    width: 45px;
    position: absolute;
    img{
      height: 100%;
      width: 100%;
    }
  }
}
.FileDealer{
  cursor:none;
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  border: 6px dashed $generalLessDarkenCover;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $generalTranparentWhite;
  z-index: 100;
  text-align: center;
  svg{
    z-index: 101;
    font-size: 66px;
    fill: $generalLessDarkenCover;
  }
  .Content{
    z-index: 101;
    font-size: 56px;
    font-family: $generalFontFamily;
    color: $generalLessDarkenCover;
  }
  ._f_loader{
    z-index: 102;
    position: absolute;
    height: 100vh;
    width: 100vw;
    opacity: 0;
  }
}
.LoadingScreen{
  cursor:none;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color:lightgray;

}
.letter-holder {
  padding: 16px;
}
.l-1 {
  animation-delay: 0.48s;
}
.l-2 {
  animation-delay: 0.6s;
}
.l-3 {
  animation-delay: 0.72s;
}
.l-4 {
  animation-delay: 0.84s;
}
.l-5 {
  animation-delay: 0.96s;
}
.l-6 {
  animation-delay: 1.08s;
}
.l-7 {
  animation-delay: 1.2s;
}
.l-8 {
  animation-delay: 1.32s;
}
.l-9 {
  animation-delay: 1.44s;
}
.l-10 {
  animation-delay: 1.56s;
}
.letter {
  float: left;
  font-size: 32px;
  color: $generalWhite;
  animation-name: loading;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-direction: linear;
}
.ShowUp{
  animation: loading 1s linear forwards;
}
@keyframes loading{
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.MainBox{
  cursor:none;
  height: 100vh;
  width: 100vw;
  min-width: 1030px;
  min-height: 630px;
  overflow: hidden;
  .MusicWrapper{
    height: 100%;
    width: 100%;
    min-width: 1030px;
    min-height: 630px;
    display: flex;
    .PopupWindowModifyWrapper{
      z-index: 100;
      position: absolute;
      top: 0px;
      left: 0px;
      height: 100vh;
      width:100vw;
      background-color: $generalTranparentWhite;
      backdrop-filter: blur(6px);
      display: flex;
      justify-content: center;
      align-items: center;
      .PopupWindowModify{
        height: 600px;
        width: 800px;
        transform: $generalAngle;
        .title{
          width: 100%;
          height: 40px;
          font-size: 38px;
          display: flex;
          align-items: center;
          background-color: $generalDarkenCover;
          padding: 8px;
          margin-left: -8px;
          
          
          .content{
            float: left;
            flex: 1;
            width: 0;
            text-align: center;
            color: $generalWhite;
            transform: $generalContentAngle;
            word-break: keep-all;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .close{
            width: 45px;
            text-align: center;
            float: right;
            fill: $generalWhite;
            svg{
              transform: $generalContentAngle;
            }
          }
        }
        .window{
          height: 540px;
          width: 100%;
          background-color: $generalCover;
          .pw_item_container{
            width: 100%;
            height: 400px;
            display: inline-flex;
            // flex-direction: column;
            // justify-content: space-evenly;
            .pw_item{
              margin-top: 16px;
              width: 50%;
              height: 400px;
              // display: inline-flex;
            }
            .pw_left{
              padding: 8px;
              box-sizing: border-box;
              .pw_inputer_item{
                width: 100%;
                height: 45px;
                padding-left: 6px;
                padding-right: 6px;
                box-sizing: border-box;
                display: inline-flex;
                font-size: 28px;
                transition: background 0.6s;
                .pw_ii_title{
                  width: 20%;
                  height: 100%;
                  color: $generalWhite;
                  .content{
                    transform: $generalContentAngle;
                  }
                }
                .inputer{
                  width: 80%;
                  height: 100%;
                  input{
                    width: 100%;
                    height: 100%;
                    font-size: 28px;
                    outline: none;
                    border: none;
                    transform: $generalContentAngle;
                    transition: background 0.6s;
                    background-color: transparent;
                    color: $generalWhite;
                  }
                  input:focus{
                    border: none;
                    outline: none;
                  }
                }
              }
              .pw_inputer_item:hover{
                transition: background 0.6s;
                background: $generalLightenerWhite;
              }
              .pw_inputer_item.alert{
                background-color: $generalAlertRed;
                color: $generalWhite;
                line-height: 45px;
                vertical-align: middle;
                .content{
                  transform: $generalContentAngle;
                  font-size: 18px;
                  width: 100%;
                  text-align: center;
                }
              }
              .pw_inputer_item.alert:hover{
                background-color: $generalAlertRed;
              }
            }
            .pw_right{
              padding: 8px;
              border-left:1px dashed $generalDarkenCover;
              box-sizing: border-box;
              position: relative;
              .inputer_cover{
                position: absolute;
                left: 0px;
                top: 0px;
                width: 100%;
                height: 100%;
                input{
                  height: 100%;
                  width: 100%;
                  opacity: 0;
                }
                background-color: $generalTranparentWhite;
                border: 1px dashed $generalWhite;
              }
              .inputer_cover_display{
                width: 100%;
                aspect-ratio: 1 / 0.7;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                img{
                  height: 175%;
                  width: 175%;
                  object-fit: cover;
                  transform: $generalContentAngle;
                }
              }
              .hint{
                font-size: 26px;
                color: $generalWhite;
                width: 100%;
                text-align: center;
                transform: $generalContentAngle;
              }
            }

          }
          .function_btns{
              width: 100%;
              height: 140px;
              display: inline-flex;
                .placeHolder{
                  width: 40%;
                  height: 100%;
                }
                .btns_Container{
                  width: 60%;
                  padding: 12px;
                  box-sizing: border-box;
                  display: flex;
                  align-items: center;
                  justify-content: space-evenly;
                  .pw_btn{
                    user-select: none;
                    text-align: center;
                    width: 102px;
                    line-height: 45px;
                    vertical-align: middle;
                    font-size: 26px;
                    height: 45px;
                    background-color: $generalDarkenCover;
                    color: $generalWhite;
                    .content{
                      transform: $generalContentAngle;
                    }
                  }
                }
              }
        }
      }
    }
    .Mitem{
      transform: $generalAngle;
      // flex: 1;
      height: 100%;
      
      // background-color: pink; /*temp*/
      // border: 1px solid black; /* temp */
    }
    
    .left{
      width: 15%;
      max-width: 225px;
      min-width: 105px;
      z-index: 20;
      transform: $generalAngle translateX(-100%);
      .top_left_item{
        margin-top: 8px;
        height: 25%;
        width: 100%;
        max-height: 85px;
        min-height: 70px;
        // text-align: right;
        display: flex;
        justify-content: right;
        align-items: center;
        font-size: 35px;
        border-right:8px solid $generalWhite;
        color: $generalWhite;
        svg{
          transform: $generalContentAngle translateX(-140%);
          fill: $generalWhite;
        }
        background-color: #000000;
      }
    }
    .mid{
      z-index: 23;
      min-width: 325px;
      width: 40%;
      max-width: 505px;
      background-color: $generalCover;
      position: relative;
      user-select: none;
      .top_item{
        // margin-top: 10px;
        // margin-left: -4px;
        z-index: 33;
        height: 81px;
        width: 100%;
        background-color: $generalDarkenCover;
        padding: 4px;
        color: $generalLightenWhite;
        display: inline-flex;
        position: fixed;
        top: 10px;
        left: -4px;
        .subitem{
          width: 50%;
          padding: 12px;
          box-sizing: border-box;
          height: 100%;
          transform: $generalContentAngle;
        }
        .sleft{
          margin-left: 12px;
          svg{
            fill: $generalWhite;
            font-size: 20px;
          }
          .title{
            
            font-size: 13px;
            font-family: $generalFontFamily;
            width: 100%;
            height: 40%;
          }
          .method{
            height: 60%;
            width: 100%;
            font-size: 20px;
            svg{
              font-size: 24px;
              padding-top: 4px;
            }
            display: inline-flex;
            // justify-content: center;
            align-items: center;
            // font-weight: bold;
            .content{
              margin-left: 4px;
            }
          }

        }
        .sright{
          display: inline-flex;
          justify-content: center;
          align-items: center;
          .ssitem{
            width: 49%;
            height: 100%;
          }
          .ssitem_divider{
            width: 2%;
            height: 60%;
            border-left: 1px solid $generalLightenWhite;
            transform: $generalAngle;
          }
          .ssl{
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .random_icon{
              display: inline-flex;
              align-items: flex-end;
              justify-content: center;
              width: 100%;
              user-select: none;
              ._1,._3{
                color: $generalLightenerWhite;
                font-size: 25px;
              }
              ._2{
                color: $generalWhite;
                font-size: 32px;
              }
            }
          }
          .ssr{
            display: inline-flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .setting_icon{
              display: inline-flex;
              align-items: flex-end;
              justify-content: center;
              width: 100%;
              user-select: none;
              font-size: 32px;
              padding: 5px;
              // padding-top: 5px;
              svg{
                fill: $generalWhite;
              }
            }
          }
        }
      }
      .middle_item{
        // top: px;
        left: 0px;
        width: 100%;
        height: 100%;
        // overflow-x: visible;
        // overflow-y: scroll;
        position: absolute;
        .transparent_holder{
          height: 95px;
          width: 100%;
          position: fixed;
          pointer-events: none;
          top: 190px;
          left: 0px;
          backdrop-filter: blur(10px);
        }
        .list_item{
          height: 95px;
          width: 100%;
          display: inline-flex;
          .item_left{
            width: 80%;
            height: 100%;
            font-family: $generalFontFamily;
            display: flex;
            flex-direction: column;
            transform: $generalContentAngle;
            color: $generalWhite;
            justify-content: center;
            .title{
              // height: 60%;
              padding: 3px;
              margin-left: 24px;
              width: 100%;
              font-size: 28px;
            }
            .singer{
              // height: 40%;
              margin-left: 24px;
              width: 100%;
              font-size: 16px;
            }
          }
          .item_right{
            width: 20%;
            height: 100%;
            display: flex;
            transform: $generalContentAngle;
            justify-content: center;
            align-items: center;
            color: $generalWhite;
            svg{
              font-size: 58px;
            }
          }
        }
      }
      .middle_item.nocontent{
        display: flex;
        justify-content: center;
        align-items: center;
        svg{
            transform: $generalContentAngle;
            font-size: 50px;
            color: $generalLightenWhite;
          }
        .Content{
          // width: 236px;
          // height: 95px;
          font-weight: bolder;
          transform: $generalContentAngle;
          font-size: 38px;
          margin-left: 6px;
          text-align: left;
          color: $generalLightenWhite;
        }
      }
      .middle_item::-webkit-scrollbar{
        display: none;
      }
      .selected_item{
          height: 95px;
          width: 100%;
          top: 186px;
          left: -12px;
          padding: 12px;
          padding-top: 6px !important;
          padding-bottom: 6px !important;
          z-index: 33;
          background-color: $generalDarkenCover;
          display: inline-flex;
          position: absolute;
          // backdrop-filter: blur(4px);
          .item_left{
            width: 77%;
            height: 100%;
            font-family: $generalFontFamily;
            display: flex;
            flex-direction: column;
            transform: $generalContentAngle;
            color: $generalWhite;
            justify-content: center;
            .title{
              // height: 60%;
              padding: 3px;
              margin-left: 24px;
              width: 100%;
              font-size: 26px;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .singer{
              // height: 40%;
              margin-left: 24px;
              width: 100%;
              font-size: 15px;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          .item_right{
            width: 23%;
            height: 100%;
            color: $generalLightenerWhite;
            .player{
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              padding-top: 12px;
              margin-top: -12px;
              padding-bottom: 12px;
              background-color: $generalWhite;
            }
            svg{
              transform: $generalContentAngle;
              fill: $generalLightenerWhite;
              font-size: 72px;
            }
          }
          .item_right.paused{
            svg{
              transform: none;
            }
          }
        }
        
    }
    .right{
      padding-left: 64px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-width: 675px;
      width: 55%;
      max-width: 875px;
      .CoverDisplayer{
        height: 505px;
        width: 100%;
        overflow: hidden;
        position: relative;
        .SwipeItemEffectCoverWrapper{
            position: absolute;
            top: 0;
            left: -55px;
            bottom: 0;
            height: 505px;
            display: flex;
            align-items: center;
            justify-content: center;
            .SwipeItemEffectCover{
              height: 125%;
              width: 125%;
              transform: $generalContentAngle;
              background-color: transparent;
            }
          }
        .SwipeCoverWrapper{
          z-index: 23;
          position: absolute;
          // top: 0px;
          left: -55px;
          // transform: $generalContentAngle;
          width: 100%;
          
          .SwipeCoverItem{
            height: 505px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .AttentionCover{
              font-size: 88px;
              margin-left: 88px;
              // opacity: 0.8;
              color:$generalUnactiveWhite;
              text-align: center;
              svg{
                fill: $generalUnactiveWhite;
              }
              .slogan{
                width: 100%;
                font-size: 53px;
                // font-weight: 200;
              }
              font-family: $generalFontFamily;
              transform: $generalContentAngle;
              user-select: none;
            }
            img{
              height: 125%;
              width: 125%;
              transform: $generalContentAngle translateX(5%);
              object-fit: cover;
            }
            width: 100%;
          }
        }
        // border: 1px solid black;
        background-color: $generalLessDarkenCover;
        box-shadow: 0px 0px 24px gray;
        // filter: drop-shadow();
      }
      .ControlBar{
        margin-top: 32px;
        height: 68px;
        width: 100%;
        box-shadow: 0px 0px 24px gray;
        // border: 1px solid black;
        display: flex;
        background-color: $generalLessDarkenCover;
        .cb_item{
          width: 15%;
          height: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          .content{
            transform: $generalContentAngle;
            font-size: 32px;
          }
        }
        .cb_item.longer{
          flex: 1;
          width: 0;
          height: 100%;
          background-color: transparent;
          color: $generalWhite;
        }
        .cb_item.wb{
          background-color: $generalWhite;
          color: $generalLightenerWhite;
        }
        .cb_item.double{
          width: 30%;
          justify-content: space-around;
        }
      }
    }
  }
}
</style>
