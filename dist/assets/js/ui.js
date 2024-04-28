window.addEventListener("DOMContentLoaded", () => {
  commonInit();
  //formFunc();
});
window.addEventListener("load", () => {
  layoutFunc();
});
$(function() {

});


/**
 * device check
 */
function commonInit() {
  let touchstart = "ontouchstart" in window;
  let userAgent = navigator.userAgent.toLowerCase();
  if (touchstart) {
    browserAdd("touchmode");
  }
  if (userAgent.indexOf("samsung") > -1) {
    browserAdd("samsung");
  }

  if (
    navigator.platform.indexOf("Win") > -1 ||
    navigator.platform.indexOf("win") > -1
  ) {
    browserAdd("window");
  }

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    // iPad or iPhone
    browserAdd("ios");
  }

  function browserAdd(opt) {
    document.querySelector("html").classList.add(opt);
  }
}

/*
  resize
*/
function resizeAction(callback) {
  let windowWid = 0;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== windowWid) {
      if (callback) {
        callback();
      }
    }
    windowWid = window.innerWidth;
  });
}

/**
 * 레이아웃
 */
function layoutFunc() {
  const header_wrap = document.querySelector(".header_wrap");
  const header_inner = document.querySelector(".header_inner");
  const middle_wrap = document.querySelector(".middle_wrap");
  const header_layer = Array.from(document.querySelectorAll(".header_layer"));
  const page_wrap = document.querySelector(".page_wrap");
  let header_wrap_height = 0;
  const bottom_layer_wrap = document.querySelector(".bottom_layer_wrap");
  const btn_topgo = document.querySelector(".btn_topgo");
  let btn_topgo_height = 0;

  if (!!btn_topgo) {
    btn_topgo.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    });
  }

  action();
  window.addEventListener("resize", () => {
    action();
  });

  function action() {
    if (!!header_layer && !!header_inner) {
      let widValue = header_layer.map(item => item.getBoundingClientRect().width);
      let maxWidth = Math.max(...widValue);
      header_inner.style.paddingLeft = maxWidth + "px";
      header_inner.style.paddingRight = maxWidth + "px";
    }
    if (!!header_wrap && !!page_wrap) {
      header_wrap_height = header_wrap.getBoundingClientRect().height;
      page_wrap.style.paddingTop = header_wrap_height + "px";
    }
    if (!!bottom_layer_wrap && !!page_wrap) {
      if (!!btn_topgo) {
        btn_topgo_height = btn_topgo.getBoundingClientRect().height + 40;
      }
      page_wrap.style.paddingBottom = (bottom_layer_wrap.getBoundingClientRect().height + btn_topgo_height) + 'px';
    }
    if (!!middle_wrap && !bottom_layer_wrap) {
      middle_wrap.classList.add("mbtype2");
    }
  }
}

/* rock */
function rockMenu(item) {
  const itemMenu = document.querySelector(item);
  if (!!itemMenu) {
    itemMenu.classList.add("active");
  }
}

/* popup */
class DesignPopup {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.popup_box_item = this.selector.querySelector(".popup_box_item");
    if (!this.selector) {
      return;
    }

    this.design_popup_wrap = document.querySelectorAll(".popup_wrap");
    this.domHtml = document.querySelector("html");
    this.domBody = document.querySelector("body");
    this.pagewrap = document.querySelector(".page_wrap");
    this.layer_wrap_parent = null;
    this.btn_closeTrigger = null;
    this.scrollValue = 0;

    // init
    const popupGroupCreate = document.createElement("div");
    popupGroupCreate.classList.add("layer_wrap_parent");
    if (!this.layer_wrap_parent && !document.querySelector(".layer_wrap_parent")) {
      this.pagewrap.append(popupGroupCreate);
    }
    this.layer_wrap_parent = document.querySelector(".layer_wrap_parent");


    // event
    this.btn_close = this.selector.querySelectorAll(".btn_popup_close");
    this.bg_design_popup = this.selector.querySelector(".bg_dim");
    let closeItemArray = [...this.btn_close];
    if (!!this.selector.querySelectorAll(".close_trigger")) {
      this.btn_closeTrigger = this.selector.querySelectorAll(".close_trigger");
      closeItemArray.push(...this.btn_closeTrigger);
    }
    if (closeItemArray.length) {
      closeItemArray.forEach((element) => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          this.popupHide(this.selector);
        }, false);
      });
    }
  }
  dimCheck() {
    const popupActive = document.querySelectorAll(".popup_wrap.active");
    if (!!popupActive[0]) {
      popupActive[0].classList.add("active_first");
    }
    if (popupActive.length > 1) {
      this.layer_wrap_parent.classList.add("has_active_multi");
    } else {
      this.layer_wrap_parent.classList.remove("has_active_multi");
    }
  }
  popupShow() {
    this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
    if (this.selector == null) {
      return;
    }
    this.domHtml.classList.add("touchDis");
    this.selector.classList.add("active");
    /* if(!!this.popup_box_item){
      this.popup_box_item.setAttribute("tabindex","0");
    }
     */
    setTimeout(() => {
      this.selector.classList.add("motion_end");
      // setTabControl(this.selector);
    }, 30);
    if ("beforeCallback" in this.option) {
      this.option.beforeCallback();
    }
    if ("callback" in this.option) {
      this.option.callback();
    }
    if (!!this.design_popup_wrap_active) {
      this.design_popup_wrap_active.forEach((element, index) => {
        if (this.design_popup_wrap_active !== this.selector) {
          element.classList.remove("active");
        }
      });
    }
    this.layer_wrap_parent.append(this.selector);
    this.dimCheck();
  }
  popupHide() {
    let target = this.option.selector;
    if (!!target) {
      this.selector.classList.remove("motion");
      if ("beforeClose" in this.option) {
        this.option.beforeClose();
      }
      //remove
      this.selector.classList.remove("motion_end");
      if (!!this.popup_box_item) {
        this.popup_box_item.removeAttribute("tabIndex");
      }
      setTimeout(() => {
        this.selector.classList.remove("active");
      }, 400);
      this.design_popup_wrap_active = document.querySelectorAll(".popup_wrap.active");
      this.dimCheck();
      if ("closeCallback" in this.option) {
        this.option.closeCallback();
      }
      if (this.design_popup_wrap_active.length == 1) {
        this.domHtml.classList.remove("touchDis");
      }
    }
  }
}


function bottomLayer() {

}



/* 레이어 포커스 머물게 하는 함수 */
function setTabControl(element) {
  let focusable = [];
  let el_firstFocus = null;
  let el_lastFocus = null;
  let targetElement = typeof element == "object" ? element : document.querySelector(element);
  const targetElementAll = targetElement.querySelectorAll("*");
  targetElement.setAttribute("tabIndex", "0");
  if (!!targetElementAll) {
    targetElementAll.forEach((item) => {
      if (item.tagName.match(/^A$|AREA|INPUT|TEXTAREA|SELECT|BUTTON/gim) && parseInt(item.getAttribute("tabIndex")) !== -1) {
        focusable.push(item);
      }
      if ((item.getAttribute("tabIndex") !== null) && (parseInt(item.getAttribute("tabIndex")) >= 0) && (item.getAttribute("tabIndex", 2) !== 32768)) {
        focusable.push(item);
      }
    });
  }

  el_firstFocus = focusable[0];
  el_lastFocus = focusable[focusable.length - 1];
  el_firstFocus.addEventListener("keydown", (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode == 9) {
      if (e.shiftKey) {
        el_lastFocus.focus();
        e.preventDefault();
      }
    }
  });
  el_lastFocus.addEventListener("keydown", (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode == 9) {
      if (!e.shiftKey) {
        el_firstFocus.focus();
        e.preventDefault();
      }
    }
  });
  el_firstFocus.focus();
}


function formFunc() {
  addDynamicEventListener(document.body, 'change', '.combo_select', function(e) {
    let thisTarget = e.target;
    if (thisTarget.value === "") {
      thisTarget.classList.add("placeholder");
    } else {
      thisTarget.classList.remove("placeholder");
    }
  });
}


class ComboSelect {
  constructor(option) {
    // variable
    this.option = option;
    this.selector = document.querySelector(this.option.selector);
    this.middle_contents_row = document.querySelector(".middle_contents_row");
    this.header_wrap = document.querySelector(".header_wrap");
    this.middle_wrap = document.querySelector(".middle_wrap");
    this.popup_box_contents_row = document.querySelector(".popup_box_contents_row");
    this.popup_contents_row = document.querySelector(".popup_contents_row");
    this.combobox_target = null;
    this.combobox_target_text = null;
    this.combobox_option_wrap = null;
    this.combobox_option = null;
    if (!this.selector) {
      return;
    }
    this.combobox_target = this.selector.querySelector(".combobox");
    this.combobox_target_text = this.selector.querySelector(".combobox_text");
    this.combobox_option_wrap = this.selector.querySelector(".combobox_option_wrap");
    this.combobox_option = this.selector.querySelectorAll(".combobox_option");
    this.option_active = false;
    this.bindEvent();
  }
  bindEvent() {
    this.combobox_target.addEventListener("click", (e) => {
      e.preventDefault();
      this.combobox_option_wrap.setAttribute("data-optiongroup", this.selector.getAttribute("id"));
      if (!!this.selector.closest(".popup_box_contents_row")) {
        // this.popup_box_contents_row.append(this.combobox_option_wrap);
      } else if (!!this.selector.closest(".popup_contents_row")) {
        this.popup_contents_row.append(this.combobox_option_wrap);
      } else {
        this.middle_wrap.append(this.combobox_option_wrap);
      }


      this.positionAction();

      if (this.option_active) {
        this.optionHide();
      } else {
        this.optionShow();
      }

      this.option_active = !this.option_active;
    });
    this.combobox_option.forEach((eventItem) => {
      eventItem.addEventListener("click", (e) => {
        e.preventDefault();
        let eventTarget = e.currentTarget;
        this.combobox_target_text.textContent = eventTarget.textContent;
        this.combobox_target.classList.add("has_value");
        this.optionHide();
        this.option_active = false;
        if (!!this.option.callback) {
          this.option.callback(eventTarget.getAttribute("data-value"));
        }
      });
    });
    window.addEventListener("resize", () => {
      this.positionAction();
    });
  }
  optionShow() {

    this.combobox_option_wrap.classList.add("active");
    this.ariaCheck();
    this.combobox_option_wrap.setAttribute("tabindex", "0");
    this.combobox_option_wrap.focus();
    this.optionScroll();
  }
  optionScroll() {
    let optionList = this.combobox_option_wrap.dataset.scroll;
    let optionDefault = 3;
    if (!optionList) {
      optionList = optionDefault;
    }
    this.combobox_option_wrap.style.maxHeight = this.combobox_option[optionList].getBoundingClientRect().top - this.combobox_option_wrap.getBoundingClientRect().top - window.scrollY + "px";
  }
  optionHide() {
    this.combobox_option_wrap.classList.remove("active");
    this.ariaCheck();
  }
  ariaCheck() {
    this.combobox_target.setAttribute("aria-expanded", this.combobox_option_wrap.classList.contains("active"));
  }
  positionAction() {
    let header_height_value = this.header_wrap.getBoundingClientRect().height;
    let pos_top_value = this.combobox_target.getBoundingClientRect().top;
    let pos_left_value = this.combobox_target.offsetLeft;
    let pos_width_value = this.combobox_target.getBoundingClientRect().width;
    let height_value = this.combobox_target.getBoundingClientRect().height;


    this.combobox_option_wrap.removeAttribute('style');
    this.combobox_option_wrap.style.top = (pos_top_value + height_value + window.scrollY - header_height_value) + "px";
    this.combobox_option_wrap.style.left = pos_left_value + "px";
    this.combobox_option_wrap.style.width = pos_width_value + "px";

    if (!!this.selector.closest(".popup_box_contents_row")) {
      this.combobox_option_wrap.style.top = (pos_top_value + height_value) - (this.popup_box_contents_row.getBoundingClientRect().top + this.popup_box_contents_row.scrollTop) + "px";
    } else if (!!this.selector.closest(".popup_contents_row")) {
      this.combobox_option_wrap.style.top = (pos_top_value + height_value) - (this.popup_contents_row.getBoundingClientRect().top + this.popup_contents_row.scrollTop) + "px";
    } else {
      this.combobox_option_wrap.style.top = (pos_top_value + height_value + window.scrollY - header_height_value) + "px";
    }

    this.optionScroll();
  }
}