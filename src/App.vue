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
    <div class="ToastMessageWrapper">
      <div class="ToastMessage" :class="{disappear:!pageState.is_show_toast,display:pageState.is_show_toast}">
        <div class="content">
          {{ pageState.toast_message }}
        </div>
      </div>
    </div>
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
                  <div class="content" v-if="!pageState.is_modify_mode">似乎在歌单中存在一首相同歌曲!</div>
                  <div class="content" v-else>你正在编辑一首已存在歌曲!</div>
                </div>
                <div class="pw_inputer_item info" v-if="pageState.is_find_same&&pageState.is_modify_mode">
                  <div class="content" v-if="song_status_map[pageState.songList[pageState.now_index].bucket_id]">这首歌您共听了{{ song_status_map[pageState.songList[pageState.now_index].bucket_id] }} 次!</div>
                  <div class="content" v-else>这首歌您还未完整听过一次!</div>
                </div>
                <div class="pw_inputer_item success" v-if="pageState.now_playing_index==pageState.now_index&&pageState.is_modify_mode">
                  <div class="content">您正在听这首歌!</div>
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
                  <div class="content" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle" @click="saveData">确定</div></div>
                <div class="pw_btn">
                  <div class="content" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle" @click="closePW">取消</div>
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
            <div class="ssitem ssl" @click="select_an_random_song" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
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
            <div class="ssitem ssr" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
              <div class="setting_icon" @click="()=>{pageState.is_show_setting_window=!pageState.is_show_setting_window}">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z"/>
                </svg>
              </div>
              <div class="title" @click="()=>{pageState.is_show_setting_window=!pageState.is_show_setting_window}">
                设置
              </div>
              <div class="setting_window" :class="{popUp:pageState.is_show_setting_window,scrollin:!pageState.is_show_setting_window}" @mousedown="()=>{pageState.is_swipe_command_waiting=true;}" @touchstart="()=>{pageState.is_swipe_command_waiting=true;}" @mouseleave="pageState.is_swipe_command_waiting=false;" @mouseup="pageState.is_swipe_command_waiting=false;" @touchend="pageState.is_swipe_command_waiting=false;" @touchcancel="pageState.is_swipe_command_waiting=false;">
                <div class="setting_item" v-if="(typeof pageState.songList[pageState.now_index]!='undefined')" @click="popUpDownload(pageState.songList[pageState.now_index].src,pageState.songList[pageState.now_index].filename)">
                  <div class="title">下载选中歌曲</div>
                  <div class="functionWrapper">
                    <div class="setting_icon_set">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/></svg>
                    </div>
                  </div>
                </div>
                <div class="setting_item" v-if="(typeof pageState.songList[pageState.now_playing_index]!='undefined')" @click="popUpDownload(pageState.songList[pageState.now_playing_index].src,pageState.songList[pageState.now_playing_index].filename)">
                  <div class="title">下载播放的歌曲</div>
                  <div class="functionWrapper">
                    <div class="setting_icon_set">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 464a208 208 0 1 1 0-416 208 208 0 1 1 0 416zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM376.9 294.6c4.5-4.2 7.1-10.1 7.1-16.3c0-12.3-10-22.3-22.3-22.3H304V160c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32v96H150.3C138 256 128 266 128 278.3c0 6.2 2.6 12.1 7.1 16.3l107.1 99.9c3.8 3.5 8.7 5.5 13.8 5.5s10.1-2 13.8-5.5l107.1-99.9z"/></svg>
                    </div>
                  </div>
                </div>
                <div class="setting_item" v-if="(typeof pageState.songList[pageState.now_index]!='undefined')" @click="deleteSong(pageState.now_index)">
                  <div class="title">删除选中歌曲</div>
                  <div class="functionWrapper">
                    <div class="setting_icon_set">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    </div>
                  </div>
                </div>
                <div class="setting_item" v-if="(typeof pageState.songList[pageState.now_playing_index]!='undefined')" @click="deleteSong(pageState.now_playing_index)">
                  <div class="title">删除播放中的歌曲</div>
                  <div class="functionWrapper">
                    <div class="setting_icon_set">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                    </div>
                  </div>
                </div>
                <div class="setting_item">
                  <div class="title">播放方式</div>
                  <div class="functionWrapper">
                    <div class="switch_item">
                      <div class="switch_arrow_left" @click="_last_play_mode();">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>
                      </div>
                      <div class="switch_content_wrapper">
                        <div class="content_switch_item" v-for="(s_item,s_index) in playModeList" :key="'sw'+s_index" :class="{switch_selected:s_index==pageState.now_play_mode_index}" :style="{left:`${(s_index-pageState.now_play_mode_index)*100}%`}">
                          {{s_item.title}}
                        </div>
                      </div>
                      <div class="switch_arrow_right" @click="_next_play_mode();">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
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
          <div class="list_item" v-for="(_item,_index) in pageState.songList" @click="goByIndex(_index)" :key="'si'+_index" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
            <div class="item_left">
              <div class="title">{{ _item.title }}</div>
              <div class="singer">{{ _item.singer }}</div>
            </div> 
            <div class="item_right">
              <div class="player" v-if="_index != pageState.now_playing_index || !pageState.isSongPlaying">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
              </div>
              <div class="player paused" v-else>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
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
            <div class="item_right" v-if="!pageState.isSongPlaying || !pageState.isSameSong" @click="song_play();" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
              <div class="player">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
                  <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                </svg>
              </div>
            </div>
            <div class="item_right paused" v-else @click="song_pause();" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
              <div class="player">
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
              </div>
            </div>
          </div>
      </div>
      <div class="Mitem right">
        <div class="CoverDisplayer">
          <div class="album_display" v-if="pageState.songList.length!=0">
                <div class="content" v-if="pageState.songList[pageState.now_index].album.length>0">
                  {{ pageState.songList[pageState.now_index].album }}
                </div>
                <div class="content" v-else>
                  ~ UNKNOWN ~
                </div>
              </div>
          <div class="CoverDisplayerWrapper">
              <div class="SwipeCoverWrapper" :style="{top:`${pageState.cover_top}px`}" v-if="pageState.songList.length!=0">
              <div class="SwipeCoverItem" v-for="(i_item,i_index) in pageState.songList" :key="'i_'+i_index" :class="{top:pageState.now_index==i_index}">
                <img :src="i_item.cover" v-if="i_item.cover!=''">
                <div class="AttentionCover" v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M88 0C74.7 0 64 10.7 64 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C120.5 112.3 128 119.9 128 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C119.5 47.7 112 40.1 112 24c0-13.3-10.7-24-24-24zM32 192c-17.7 0-32 14.3-32 32V416c0 53 43 96 96 96H288c53 0 96-43 96-96h16c61.9 0 112-50.1 112-112s-50.1-112-112-112H352 32zm352 64h16c26.5 0 48 21.5 48 48s-21.5 48-48 48H384V256zM224 24c0-13.3-10.7-24-24-24s-24 10.7-24 24c0 38.9 23.4 59.4 39.1 73.1l1.1 1C232.5 112.3 240 119.9 240 136c0 13.3 10.7 24 24 24s24-10.7 24-24c0-38.9-23.4-59.4-39.1-73.1l-1.1-1C231.5 47.7 224 40.1 224 24z"/></svg>
                  <div class="slogan">Enjoy your life.</div>
                </div>
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
          
        </div>
        <div class="ControlBar">
          <div class="cb_white_cover" :class="{cbc_left:pageState.controlBarSelection==0,cbc_right:pageState.controlBarSelection==1}"></div>
          <div class="cb_item df" @click="()=>{pageState.controlBarSelection=0;}" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
            <div class="content">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>         
            </div>
          </div>
          <div class="cb_item df" @click="()=>{pageState.controlBarSelection=1;}" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
            <div class="content">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"/></svg>
            </div>
          </div>
          <div class="cb_item longer">
            <div class="content l_l volume" :class="{l_left:pageState.controlBarSelection==0,l_right:pageState.controlBarSelection==1}">
              <div class="slider" id="volume-slider">
                <div class="progress">
                  <div class="progress_white" :style="{left:`${pageState.volume}%`}"></div>
                </div>
                <div class="dot" :style="{left:`${pageState.volume}%`}" @mousedown="slider_event_handler.volume_slider_handler" :class="{onMoving:pageState.isMovingVolumeBar}"></div>
              </div>
            </div>
            <div class="content l_r" :class="{l_left:pageState.controlBarSelection==0,l_right:pageState.controlBarSelection==1}">
              <div class="slider" id="music-slider">
                <div class="progress">
                  <div class="progress_white" :style="{left:`${pageState.musicprogress}%`}"></div>
                </div>
                <div class="dot" :style="{left:`${pageState.musicprogress}%`}" @mousedown="slider_event_handler.music_slider_handler" :class="{onMoving:!pageState.isAllowChangeMusicProgress}"></div>
              </div>
            </div>
          </div>
          <div class="cb_item wb modify" @click="modify_the_song" @mouseenter="_general_function_btn_mousein_handle" @mouseleave="_general_function_btn_mouseout_handle">
            <div class="content">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
            </div>
            <div class="content small">
              修改信息  
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import _parser from 'id3-parser';
import _cursor_arrow from './assets/arrow.gif';
import _cursor_working from './assets/working.gif';
import _cursor_link from './assets/link.gif';
const LIST_KEY="ALLImportList"
// const mmb=require('music-metadata-browser')

// TO DO LIST：
// Music wave on CANVAS - √
// lyrics displayer - canceled
// display album √
// able to modify music info √
// Toast Displayer √
// random selection √
// setting button should allow you to delete a song √
// setting button should allow you to redownload the song √
// setting button should allow you to set list play method - √
// sort function - postpone
// support FLAC album cover singer get. - postpone
// Music Data Save in IndexedDB √
// More Accurate Check Same Song √
// paused btn should check is the same song. √
// play function should check has the same song was playing. √
// remember last played - √
// volume&music slider √
// more cursor chagne √
const BASEMENT_START=186;
const BASEMENT_HEIGHT=95;
const BASEMENT_HEIGHT_COVER=505;
const DEFAULT_VOLUME=0.6;
//get volume
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
  now_mouse_x:-1,
  is_swipe_end:false,
  songList:[],
  now_playing_index:-1,
  is_swipe_command_waiting:false,
  is_swipe_cancel:false,
  is_file_drag_in:false,
  is_show_modify_window:false,
  is_modify_mode:false,
  is_show_modify_image_importer:false,
  is_on_working:false,
  is_find_same:false,
  is_show_setting_window:false,
  isDBReady:false,
  isInitDone:false,
  controlBarSelection:-1,
  isSongPlaying:false,
  isCancelForNonMouseEvent:false,
  is_show_toast:false,
  toast_message:"Hello World",
  toast_destoryer_id:null,
  volume:0,
  musicprogress:0,
  isMovingVolumeBar:false,
  isAllowChangeMusicProgress:true,
  isSameSong:true,
  _now_playing:null,
  _cursor:_cursor_working,
  _curosr_mode:'cursor',
  _cursor_pos:[0,0],
  modify_song_data_bucket:{
    title:"",
    cover:"",
    singer:"",
    album:"",
    _h_src:"",
    _h_filename:"",
    _h_cover_u8a:new Uint8Array(0),
    _h_cover_mime:"",
    _h_song_u8a:[],
    _h_song_mime:"",
    _h_song_size:0,
    _h_song_bucket_id:"",
    modify_index:-1,
  },
  is_show_cursor:true,
  now_play_mode_index:3,
});
let _next_play_callback=()=>{
  pageState._now_playing.currentTime=0;
  song_pause();
}
const _get_next_song_index=(index)=>{
  if(index+1>=pageState.songList.length){
    return -1;
  }else{
    return index+1;
  }
}
let song_status_map={};
const song_play_status=reactive({
  _actual_playtime_ts:0,
  _played_song_id:'',
  _song_played_times:0,
  _song_duration:0,
});

const playModeList=[
  {
    "title":"顺序播放",
    "callBack":()=>{
      const _t_index=_get_next_song_index(pageState.now_playing_index);
      if(_t_index==-1){
        pageState._now_playing.currentTime=0;
        song_pause();
      }else{
        goByIndex(_t_index);
        pageState._now_playing.src=pageState.songList[_t_index].src;
      }
    }
  },{
      "title":"列表循环",
      "callBack":()=>{
        const _t_index=_get_next_song_index(pageState.now_playing_index);
        if(_t_index==-1){
          goByIndex(0);
          pageState._now_playing.src=pageState.songList[0].src;
          pageState._now_playing.currentTime=0;
          pageState._now_playing.play();
        }else{
          goByIndex(_t_index);
          pageState._now_playing.src=pageState.songList[_t_index].src;
          pageState._now_playing.currentTime=0;
          pageState._now_playing.play();
        }
      }
    },{
      "title":"单曲循环",
      "callBack":()=>{
        pageState._now_playing.pause();
        setTimeout(()=>{
          pageState._now_playing.currentTime=0;
          pageState._now_playing.play();
        },100)
      }
    },{
      "title":"单曲播放",
      "callBack":()=>{
        pageState._now_playing.currentTime=0;
        song_pause();
      }
    },{
      "title":"随机播放",
      "callBack":()=>{
        const _t_length=pageState.songList.length;
        if(_t_length<1){
          show_Toast("请先导入歌曲!",2000);
        }else if(_t_length==1){
          goByIndex(0);
          pageState._now_playing.src=pageState.songList[0].src;
          pageState._now_playing.currentTime=0;
          pageState._now_playing.play();
        }else{
          const _t_rnd=Math.round(Math.random()*(_t_length-1));
          goByIndex(_t_rnd);
          pageState._now_playing.src=pageState.songList[_t_rnd].src;
          pageState._now_playing.currentTime=0;
          pageState._now_playing.play();
        }
      }
    }
  
];
const _next_play_mode=()=>{
  if(pageState.now_play_mode_index+1>=playModeList.length){
    pageState.now_play_mode_index=0;
  }else{
    pageState.now_play_mode_index+=1;
  }
  localStorage.setItem("playmode",pageState.now_play_mode_index);
  _next_play_callback=playModeList[pageState.now_play_mode_index]["callBack"];
}
const _last_play_mode=()=>{
  if(pageState.now_play_mode_index-1<0){
    pageState.now_play_mode_index=playModeList.length-1;
  }else{
    pageState.now_play_mode_index-=1;
  }
  localStorage.setItem("playmode",pageState.now_play_mode_index);
  _next_play_callback=playModeList[pageState.now_play_mode_index]["callBack"];
}

const popUpDownload=(url,filename)=>{
  const fileLink = document.createElement('a');
  fileLink.href = url;
  fileLink.setAttribute('download',filename);
  document.body.appendChild(fileLink);
  fileLink.click();
}
const deleteSong=(index,isOpDB=true)=>{
  // using DELETE caused '[null]' which lead to an error;fix it tomorrow;
  if(typeof pageState.songList[index]!='undefined'){
    if(pageState.now_index==index&&index>=1){
      goByIndex(pageState.now_index-1);
    }
    const _t_bid=pageState.songList[index].bucket_id;
    // console.log(_t_bid);
    if(LIST_KEY=="ALLImportList" && isOpDB){
      _DB.DBStorage_removeItem(_t_bid);
      const _t_ps=localStorage.getItem("playstatus");
      if(_t_ps!=null){
        let _t_arr=JSON.parse(_t_ps);
        let _tar_index=_t_arr.indexOf(_t_bid);
        _t_arr=[..._t_arr.slice(0,_tar_index),..._t_arr.slice(_tar_index+1)]
        localStorage.setItem("playstatus".stringify(_t_arr));
      }
    }
    const _t_l=localStorage.getItem(LIST_KEY);
    // delete pageState.songList[index];
    pageState.songList=[...pageState.songList.slice(0,index),...pageState.songList.slice(index+1)]
    if(_t_l!=null){
      let _t_arr=JSON.parse(_t_l);
      let _tar_index=_t_arr.indexOf(_t_bid);
      _t_arr=[..._t_arr.slice(0,_tar_index),..._t_arr.slice(_tar_index+1)]
      localStorage.setItem(LIST_KEY,JSON.stringify(_t_arr));
    }else{
      const _t_arr=[];
      for(let __i__ of pageState.songList){
        _t_arr.push(__i__.bucket_id);
      }
      localStorage.setItem(LIST_KEY,JSON.stringify(_t_arr));
    }
  }
}
const slider_event_handler={
  volume_bar_el:null,
  volume_slider_handler(e){
    if(this.volume_bar_el==null){
      this.volume_bar_el=document.getElementById("volume-slider");
    }
    pageState.isCancelForNonMouseEvent=true;
    pageState.isMovingVolumeBar=true;
    let start_pos_x=pageState._cursor_pos[0];
    if(e.button==0){
        pageState.move_up_event_id=setInterval(()=>{
          const _target=((pageState._cursor_pos[0]-start_pos_x)/parseFloat(getComputedStyle(this.volume_bar_el).width))*100;
          if(_target!=0){
              if(pageState.volume+_target<0){
                pageState.volume=0;
              }else if(pageState.volume+_target>100){
                pageState.volume=100;
              }else{
                pageState.volume+=_target;
              }
              set_volume(pageState.volume);
              start_pos_x=pageState._cursor_pos[0];
          }
        }
      ,50)
    }
  },
  music_bar_el:null,
  music_slider_handler(e){
    if(this.music_bar_el==null){
      this.music_bar_el=document.getElementById("music-slider");
    }
    pageState.isCancelForNonMouseEvent=true;
    pageState.isAllowChangeMusicProgress=false;
    let start_pos_x=pageState._cursor_pos[0];
    if(e.button==0){
        pageState.move_up_event_id=setInterval(()=>{
          const _target=((pageState._cursor_pos[0]-start_pos_x)/parseFloat(getComputedStyle(this.music_bar_el).width))*100;
          if(_target!=0){
              if(pageState.musicprogress+_target<0){
                pageState.musicprogress=0;
              }else if(pageState.musicprogress+_target>100){
                pageState.musicprogress=100;
              }else{
                pageState.musicprogress+=_target;
              }
              start_pos_x=pageState._cursor_pos[0];
          }
        }
      ,50)
    }
  }

}
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
const modify_the_song=()=>{
  pageState.is_modify_mode=true;
  const _t_Index=pageState.now_index;
  const _t_Bucket_id=pageState.songList[_t_Index]['bucket_id'];
  // console.log(pageState.songList[_t_Index]);
  _DB.DBStorage_getItem(_t_Bucket_id,(_v)=>{
    pageState.modify_song_data_bucket=_v;
    pageState.modify_song_data_bucket["cover"]=pageState.songList[_t_Index]["cover"]
    pageState.modify_song_data_bucket["_h_src"]=pageState.songList[_t_Index]["src"]
    pageState.modify_song_data_bucket["modify_index"]=_t_Index;
    pageState.is_show_modify_window=true;
    pageState.is_find_same=true;
  })
}
const show_Toast=(msg,duration)=>{
  pageState.toast_message=msg;
  pageState.is_show_toast=true;
  if(pageState.toast_destoryer_id!=null){
    clearTimeout(pageState.toast_destoryer_id);
  }
  pageState.toast_destoryer_id=setTimeout(()=>{
    pageState.is_show_toast=false;
    pageState.toast_destoryer_id=null;
  },duration)
}
const select_an_random_song=()=>{
  song_pause();
  const _t_length=pageState.songList.length;
  if(_t_length<1){
    show_Toast("请先导入歌曲!",2000);
  }else if(_t_length==1){
    if(pageState._now_playing!=null){
      pageState._now_playing.currentTime=0;
      pageState.isSongPlaying=true;
      pageState._now_playing.play();
    }else{
      goByIndex(0);
      song_play();
    }
    show_Toast(pageState.songList[pageState.now_index]["title"],2000);
  }else{
    const _t_rnd=Math.round(Math.random()*(_t_length-1));
    goByIndex(_t_rnd);
    song_play();
    show_Toast(pageState.songList[pageState.now_index]["title"],2000);
  }
}
const _general_function_btn_mousein_handle=()=>{
  if(pageState._curosr_mode=='cursor'){
    pageState._cursor=_cursor_link;
    pageState._curosr_mode='link';
  }
}
const _general_function_btn_mouseout_handle=()=>{
  if(pageState._curosr_mode=='link'){
    pageState._cursor=_cursor_arrow;
    pageState._curosr_mode='cursor';
  }
}
const songDataResolver_init=(data)=>{
  //title singer album cover src
  const _t_result={}
  _t_result["title"]=data["title"];
  _t_result["singer"]=data["singer"];
  _t_result["album"]=data["album"];
  _t_result["bucket_id"]=data["_h_song_bucket_id"];
  _t_result["filename"]=data["_h_filename"];
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
    let _t_c=0;
    for(let __i__ of JSON.parse(_t_sl)){
      _DB.DBStorage_getItem(__i__,(_v)=>{
        if(_v!=null){
        const _t_sd=songDataResolver_init(_v);
        pageState.songList.push(_t_sd);
        const _t_lp=localStorage.getItem("lastplayed");
        if(_t_lp!=null){
          if(_t_lp==__i__){
            pageState.now_index==_t_c;
          }
        }
      }else{
        const _t_l=localStorage.getItem(LIST_KEY);
        if(_t_l!=null){
          let _t_arr=JSON.parse(_t_l);
          let _tar_index=_t_arr.indexOf(__i__);
          _t_arr=[..._t_arr.slice(0,_tar_index),..._t_arr.slice(_tar_index+1)]
          localStorage.setItem(LIST_KEY,JSON.stringify(_t_arr));
        }
      }
    }
      )
      _t_c+=1;
    }
  }
  const _t_pm=localStorage.getItem("playmode");
  if(_t_pm==null){
    localStorage.setItem("playmode",3);
  }else{
    pageState.now_play_mode_index=parseInt(_t_pm);
    _next_play_callback=playModeList[parseInt(_t_pm)]["callBack"];
  }
  const _t_v=localStorage.getItem("volume");
  if(_t_v==null){
    pageState.volume=DEFAULT_VOLUME*100;
    localStorage.setItem("volume",DEFAULT_VOLUME*100);
  }else{
    pageState.volume=parseInt(_t_v);
  }
  const _t_ss=localStorage.getItem("playstatus");
  if(_t_ss!=null){
    song_status_map=JSON.parse(_t_ss);
  }
  //LoadMusicResource
  //LoadLastPlayed
  //LoadPlayerSetting
  const _t=setInterval(()=>{
    if(pageState.now_index!=0){
      if(typeof pageState.songList[pageState.now_index]!='undefined'){
        goByIndex(pageState.now_index)
        clearInterval(_t);
      }
    }else{
      clearInterval(_t);
    }
  },200)
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
  pageState.is_modify_mode=false;
}
const set_volume=(val)=>{
  if(pageState._now_playing!=null){
    pageState._now_playing.volume=val/100;
    localStorage.setItem("volume",val);
  }
}
const audio_seek=(percent)=>{
  if(pageState._now_playing!=null){
    pageState._now_playing.currentTime=pageState._now_playing.duration*(percent/100);
    // console.log(pageState._now_playing.duration*(percent/100),(percent/100),pageState._now_playing.duration,pageState._now_playing.currentTime)
  }
}
const canvas_animation=reactive({
  canvas_el:null,
  _ctx:null,
  _audio_context:null,// new AudioContext
  _audio_source:null,
  _audio_analyser:null,
  _wave_points:new Uint8Array(248),
  _wave_data_points:null,
  
});
function _function_painter(){
  canvas_animation._audio_analyser.getByteFrequencyData(canvas_animation._wave_points);
    const _canvas_width=parseInt(getComputedStyle(canvas_animation.canvas_el).width);
    const _canvas_height=parseInt(getComputedStyle(canvas_animation.canvas_el).height);
    canvas_animation._ctx.clearRect(0, 0, _canvas_width, _canvas_height);
    for (let __i in canvas_animation._wave_points) {
        const value = canvas_animation._wave_points[__i] / 5;
        let posX=(__i)*2;
        posX-=10;
        canvas_animation._ctx.beginPath();
        canvas_animation._ctx.lineWidth = 1;
        canvas_animation._ctx.strokeStyle = '#fffeff4f'
        canvas_animation._ctx.moveTo(posX,_canvas_height-300);
        //length= value+56
        canvas_animation._ctx.lineTo(posX+(value+56)*Math.sin(9),(_canvas_height-300)+(value+56)*Math.cos(9));
        // console.log(_canvas_height-value-56-100);
        canvas_animation._ctx.stroke();
    }
    canvas_animation._audio_analyser.getByteTimeDomainData(canvas_animation._wave_data_points);
    const height = 100, width = 400;
    canvas_animation._ctx.beginPath();
    for (let __i__ = 0; __i__ < width; __i__++) {
      canvas_animation._ctx.lineTo(__i__ + 100, 300 - (height / 2 * (canvas_animation._wave_data_points[canvas_animation._wave_data_points.length * __i__ / width | 0] / 256 - 0.5)));
    }
    canvas_animation._ctx.stroke();
    requestAnimationFrame(_function_painter);
  }
const song_play=()=>{
  if(canvas_animation.canvas_el==null){
    canvas_animation.canvas_el=document.getElementById("s_canvas_el");
    canvas_animation._ctx=canvas_animation.canvas_el.getContext("2d");
  }
  if(pageState._now_playing==null){
    const _t_cs=pageState.songList[pageState.now_index];
    const audio=new Audio(_t_cs.src);
    canvas_animation._audio_context=new AudioContext;
    canvas_animation._audio_source=canvas_animation._audio_context.createMediaElementSource(audio);
    canvas_animation._audio_analyser=canvas_animation._audio_context.createAnalyser();
    canvas_animation._audio_source.connect(canvas_animation._audio_analyser);
    canvas_animation._audio_analyser.connect(canvas_animation._audio_context.destination);
    const _t_count=canvas_animation._audio_analyser.frequencyBinCount * 44100 / canvas_animation._audio_context.sampleRate | 0;
    canvas_animation._wave_data_points=new Uint8Array(_t_count);
    _function_painter();
    // console.log(audio.volume);
    audio.volume=pageState.volume/100;

    pageState._now_playing=audio;
    pageState._actual_playtime_ts=new Date().getTime();
    const _t_bid=pageState.songList[pageState.now_index].bucket_id;
    if(typeof song_status_map[_t_bid]!=undefined){
      song_play_status._song_played_times=song_status_map[_t_bid];
    }else{
      song_status_map[_t_bid]=0;
      localStorage.setItem("playstatus",JSON.stringify(song_status_map));
      song_play_status._song_played_times=0;
    }
    song_play_status._played_song_id=_t_bid;
    song_play_status._song_duration=pageState._now_playing.duration;
    localStorage.setItem("lastplayed",_t_bid);
    
  }else if(pageState.songList[pageState.now_index].src!=pageState._now_playing.currentSrc){
    const _t_cs=pageState.songList[pageState.now_index];
    pageState._now_playing.pause();
    pageState._now_playing.currentTime=0;
    pageState._now_playing.src=_t_cs.src;
    pageState._now_playing.volume=pageState.volume/100;
  }
  pageState._now_playing.play();
  if(pageState._now_playing.onended==null){
    pageState._now_playing.onended=()=>{
      const _t_min=Math.ceil(song_play_status._song_duration/0.8);
      const _t_now=new Date().getTime();
      if(_t_now-song_play_status._actual_playtime_ts>_t_min*1000){
        song_play_status._song_played_times+=1;
        song_play_status._actual_playtime_ts=_t_now;
        song_status_map[song_play_status._played_song_id]+=1;
        localStorage.setItem("playstatus",JSON.stringify(song_status_map));
      }
      _next_play_callback();
    }
  }
  if(pageState._now_playing.ontimeupdate==null){
    pageState._now_playing.ontimeupdate=()=>{
      if(pageState.isAllowChangeMusicProgress){
          pageState.musicprogress=(pageState._now_playing.currentTime/pageState._now_playing.duration)*100;
        }
      }
  }
  pageState.isSongPlaying=true;
  pageState.isSameSong=true;
  pageState.now_playing_index=pageState.now_index;
  if(pageState._now_playing.onloadedmetadata==null){
    
    pageState._now_playing.onloadedmetadata=()=>{
      pageState._actual_playtime_ts=new Date().getTime();
      const _t_bid=pageState.songList[pageState.now_playing_index].bucket_id;
      if(typeof song_status_map[_t_bid]!='undefined'){
        song_play_status._song_played_times=song_status_map[_t_bid];
      }else{
        song_status_map[_t_bid]=0;
        localStorage.setItem("playstatus",JSON.stringify(song_status_map));
        song_play_status._song_played_times=0;
      }
      song_play_status._played_song_id=_t_bid;
      song_play_status._song_duration=pageState._now_playing.duration;
      localStorage.setItem("lastplayed",_t_bid);
    }
    
  }
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
    _h_cover_u8a:new Uint8Array(0),
    _h_cover_mime:"",
    _h_song_u8a:[],
    _h_song_mime:"",
  }
}
const saveData=()=>{
  pageState.is_on_working=true;
 
  if(!pageState.is_modify_mode){
    pageState.songList.push({
      title:pageState.modify_song_data_bucket.title,
      cover:pageState.modify_song_data_bucket.cover,
      album:pageState.modify_song_data_bucket.album,
      singer:pageState.modify_song_data_bucket.singer,
      src:pageState.modify_song_data_bucket._h_src,
      bucket_id:pageState.modify_song_data_bucket._h_song_bucket_id,
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
      _h_song_bucket_id:pageState.modify_song_data_bucket._h_song_bucket_id,
      _h_has_lyrics:false,
      _h_lyrics:[],
    });
  }else{
    pageState.songList[pageState.modify_song_data_bucket.modify_index]={
      title:pageState.modify_song_data_bucket.title,
      cover:pageState.modify_song_data_bucket.cover,
      album:pageState.modify_song_data_bucket.album,
      singer:pageState.modify_song_data_bucket.singer,
      src:pageState.modify_song_data_bucket._h_src
    }
    _DB.DBStorage_updateItem(pageState.modify_song_data_bucket._h_song_bucket_id,{
      title:pageState.modify_song_data_bucket.title,
      singer:pageState.modify_song_data_bucket.singer,
      album:pageState.modify_song_data_bucket.album,
      _h_filename:pageState.modify_song_data_bucket._h_filename,
      _h_cover_u8a:pageState.modify_song_data_bucket._h_cover_u8a,
      _h_cover_mime:pageState.modify_song_data_bucket._h_cover_mime,
      _h_song_u8a:pageState.modify_song_data_bucket._h_song_u8a,
      _h_song_mime:pageState.modify_song_data_bucket._h_song_mime,
      _h_song_size:pageState.modify_song_data_bucket._h_song_size,
      _h_song_bucket_id:pageState.modify_song_data_bucket._h_song_bucket_id,
      _h_has_lyrics:false,
      _h_lyrics:[],
    })
  }
  
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
    // console.log(JSON.stringify(ia),mime)
    const _t_blob=new Blob([ia], {type: mime});
    const _t_URL=URL.createObjectURL(_t_blob);
    pageState.modify_song_data_bucket.cover=_t_URL;
    pageState.modify_song_data_bucket._h_cover_mime=mime;
    pageState.modify_song_data_bucket._h_cover_u8a=ia;
  }
  e.target.value='';
}
const get_filename=(fullname)=>{
  const _f_arr=fullname.split('.');
  const _t_type=_f_arr[_f_arr.length-1];
  return fullname.slice(0,(fullname.length-1)-_t_type.length);
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
    const _t_parser_r= _parser(ia) || {};
    // console.log(mmb.fetchFromUrl(_t_URL));
    // console.log(_t_parser_r);
    if(typeof _t_parser_r["image"]=="undefined"){
      _t_parser_r["image"]={"data":[],"mime":""};
    }
    
    const _t_f_obj={
      "title":_t_parser_r["title"] || get_filename(e.target.files[0].name),
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
  if(index!=pageState.now_index){
    pageState.isSameSong=false;
    pageState.now_index=index;
  }
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
    // console.log(_t_num,_t_counter,speed);
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
    if(!pageState.is_swipe_end&&!pageState.isCancelForNonMouseEvent){
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
    }else if(pageState.isCancelForNonMouseEvent){
      clearInterval(pageState.move_up_event_id);
      pageState.move_up_event_id=-1;
      pageState.isCancelForNonMouseEvent=false;
      
      if(!pageState.isAllowChangeMusicProgress){
        audio_seek(pageState.musicprogress);
      }
      pageState.isAllowChangeMusicProgress=true;
      pageState.isMovingVolumeBar=false;
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
$generalSucessGreen:rgba(88, 249, 88, 0.566);
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
  position: relative;
  .ToastMessageWrapper{
    height: 100%;
    width: 100%;
    position: absolute;
    pointer-events: none;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 36;
    .ToastMessage{
      user-select: none;
      transform: $generalAngle;
      text-align: center;
      background-color: $generalDarkenCover;
      color:$generalWhite;
      padding: 6px;
      padding-left: 32px;
      padding-right: 32px;
      border-left: 5px solid $generalWhite;
      border-right: 5px solid $generalWhite;
      box-sizing: border-box;
      width: 10px;
      overflow: hidden;
      transition: opacity 0.6s,width 1.6s;
      .content{
        font-size: 22px;
        transform: $generalContentAngle;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
      }
      
    }
    .ToastMessage.display{
        width: 100%;
        opacity: 1;
    }
    .ToastMessage.disappear{
      width: 10px;
      opacity: 0;
    }
  }
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
              .pw_inputer_item.info{
                background-color: $generalTranparentWhite;
                color: $generalDark;
                line-height: 45px;
                vertical-align: middle;
                .content{
                  transform: $generalContentAngle;
                  font-size: 18px;
                  width: 100%;
                  text-align: center;
                }
              }
              .pw_inputer_item.info:hover{
                background-color: $generalTranparentWhite;
              }
              .pw_inputer_item.success{
                background-color: $generalSucessGreen;
                color: $generalDark;
                line-height: 45px;
                vertical-align: middle;
                .content{
                  transform: $generalContentAngle;
                  font-size: 18px;
                  width: 100%;
                  text-align: center;
                }
              }
              .pw_inputer_item.success:hover{
                background-color: $generalSucessGreen;
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
            position: relative;
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
            .setting_window.scrollin{
              pointer-events: none;
              width: 0px;
              height: 0px;
              opacity: 0;
              .setting_item{
                width: 0px;
                height: 0px;
              }
            }
            .setting_window{
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 356px;
              position: absolute;
              display: flex;
              transition: all 0.6s;
              flex-direction: column;
              right: -24px;
              transform: $generalAngle translateX(100%);
              align-items: center;
              padding-bottom: 8px;
              // box-shadow: -12px 6px 0px $generalWhite;
              background-color: $generalWhite;
              top: 8px;
              .setting_item{
                margin-top: 8px;
                padding-left: 12px;
                padding-right: 12px;
                transition: all 0.6s;
                background-color: $generalDarkenCover;
                height: 48px;
                width: 100%;
                display: flex;
                align-items: center;
                .title{
                  font-size: 20px;
                  color: $generalWhite;
                  transform: $generalContentAngle;
                }
                .functionWrapper{
                  flex: 1;
                  width: 0px;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: right;
                  .switch_item{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .switch_arrow_left,.switch_arrow_right{
                      height: 100%;
                      width: 20%;
                      padding-top: 3px;
                      display: flex;
                      align-items: center;
                      // background-color: $generalUnactiveWhite;
                      color: $generalWhite;
                      fill: $generalWhite;
                      font-size: 26px;
                    }
                    .switch_arrow_right{
                      justify-content: left;
                    }
                    .switch_arrow_left{
                      justify-content: right;
                    }
                    .switch_content_wrapper{
                      height: 100%;
                      width: 60%;
                      overflow: hidden;
                      font-size: 22px;
                      text-align: center;
                      position: relative;
                      .content_switch_item{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: left 0.3s;
                      }
                      .content_switch_item.switch_selected{
                      animation: breathe 2s ease-in-out infinite;
                      }
                    }
                  }
                  .setting_icon_set{
                    transform: $generalContentAngle;
                    font-size: 24px;
                    height: 24px;
                    fill: $generalWhite;
                    color: $generalWhite;
                  }
                }
              }
              .setting_item:hover{
                  .functionWrapper{
                    .setting_icon_set{
                      animation: shake 0.5s;
                    }
                }
                
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
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .singer{
              // height: 40%;
              margin-left: 24px;
              width: 100%;
              font-size: 16px;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
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
            fill:$generalWhite;
            svg{
              font-size: 58px;
            }
            .player.paused{
              transform: $generalAngle;
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
              padding-right: 16px;
              box-sizing: border-box;
              width: 100%;
              font-size: 26px;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
            .singer{
              // height: 40%;
              margin-left: 24px;
              width: 100%;
              font-size: 15px;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
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
      user-select: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-width: 675px;
      width: 55%;
      max-width: 875px;
      .CoverDisplayer:hover{
        .album_display{
          // width: 196px;
          padding-right: 52px;
          opacity: 1;
        }
        
        
      }
      .CoverDisplayer{
        height: 505px;
        width: 100%;
        position: relative;
        .CoverDisplayerWrapper{
          height: 100%;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .album_display{
              // width: 240px;
              opacity: 0;
              transition: all 1s;
              font-size: 20px;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              pointer-events: none;
              background-color: $generalLessDarkenCover;
              // padding-left: 52px;
              // padding-right: 52px;
              color: $generalWhite;
              font-family: $generalFontFamily;
              position: absolute;
              z-index: 34;
              text-align: center;
              top: 16px;
              left: -8px;
              .content{
                transform: $generalContentAngle;
                margin-left: 52px;
              }
            }
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
              height: 100%;
              width: 125%;
              z-index:40;
              transform: $generalContentAngle;
              background-color: transparent;
            }
          }
        .SwipeCoverWrapper{
          user-select: none;
          z-index: 23;
          position: absolute;
          // top: 0px;
          left: -55px;
          // transform: $generalContentAngle;
          width: 100%;
          // .SwipeCoverItem.top{
          //   z-index: 34;
          // }
          .SwipeCoverItem{
            height: 505px;
            display: flex;
            position: relative;
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
              height: 100%;
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
        user-select: none;
        margin-top: 32px;
        height: 68px;
        width: 100%;
        box-shadow: 0px 0px 24px gray;
        // border: 1px solid black;
        display: flex;
        position: relative;
        background-color: $generalLessDarkenCover;
        .cb_white_cover{
          width: 15%;
          height: 100%;
          position: absolute;
          box-sizing: border-box;
          top: 0;
          background-color: $generalWhite;
          left: 0;
          z-index: 32;
        }
        .cb_white_cover.cbc_left{
          animation: goLeft 0.2s linear forwards;
        }
        .cb_white_cover.cbc_right{
          animation: goRight 0.2s linear forwards;
        }
        .cb_item{
          z-index: 33;
          width: 15%;
          height: 100%;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          .content{
            fill: $generalWhite;
            transform: $generalContentAngle;
            font-size: 32px;
            height: 32px;
          }
        }
        .cb_item.modify{
          flex-direction: column;
          .content.small{
            font-size: 14px;
            height: 16px;
            padding-left: 4px;
          }
        }
        .cb_item.longer{
          flex: 1;
          width: 0;
          height: 100%;
          background-color: transparent;
          color: $generalWhite;
          overflow: hidden;
          justify-content: center;
          position: relative;
          align-items: center;
          .l_l{
            position: absolute;
            left: -100%;
          }
          .l_r{
            position: absolute;
          }
          .l_l.l_left{
            animation: goLeft 0.2s linear forwards;
          }
          .l_l.l_right{
            animation: goRight 0.2s linear forwards;
          }
          .l_r.l_left{
            animation: goLeft 0.2s linear forwards;
          }
          .l_r.l_right{
            animation: goRight 0.2s linear forwards;
          }
          .content{
            width: 100%;
            height: 100%;
            transform: none;
            padding: 20px;
            box-sizing: border-box;
            .slider{
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              .progress{
                position: relative;
                width: 100%;
                height: 5px;
                overflow: hidden;
                background-color: $generalUnactiveWhite;
              }
              .progress_white{
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background-color: $generalWhite;
                position: absolute;
              }
              .dot{
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 12px;
                background-color: $generalWhite;
                box-sizing: border-box;
                border: 1px solid $generalLightenerWhite;
              }
              .dot.onMoving{
                background-color: $generalUnactiveWhite !important;
              }
            }
          }
        }
        .cb_item.df{
          .content{
            color: $generalLightenerWhite !important;
            fill: $generalLightenerWhite !important;
          }
        }
        .cb_item.wb{
          background-color: $generalWhite;
          .content{
            color: $generalLightenerWhite !important;
            fill: $generalLightenerWhite !important;
          }
          
        }
        .cb_item.double{
          width: 30%;
          justify-content: space-around;
        }
      }
    }
  }
}
@keyframes goRight {
  0%{
    transform: translateX(0%);
  }
  100%{
    transform: translateX(100%);
  }
}
@keyframes goLeft {
  0%{
    transform: translateX(100%);
  }
  100%{
    transform: translateX(0%);
  }
}
@keyframes breathe {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
@keyframes shake{
  0% {
      transform: translateX(0) $generalContentAngle;
  }
  11% {
      transform: translateX(-2px) $generalContentAngle;
  }
  21% {
      transform: translateX(0) $generalContentAngle;
  }
  32% {
      transform: translateX(2px) $generalContentAngle;
  }
  41% {
      transform: translateX(0) $generalContentAngle;
  }
  52% {
      transform: translateX(-2px) $generalContentAngle;
  }
  61% {
      transform: translateX(0) $generalContentAngle;
  }
  72% {
      transform: translateX(2px) $generalContentAngle;
  }
  81% {
      transform: translateX(0) $generalContentAngle;
  }
  91% {
      transform: translateX(-2px) $generalContentAngle;
  }
  100% {
      transform: translateX(0px) $generalContentAngle;
  }
}
</style>
