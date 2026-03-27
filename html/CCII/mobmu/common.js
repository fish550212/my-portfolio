$(document).ready(function () {
  var $win = $(window),
      $pageWrap = $('.page-wrap'),
      $navPanel = $('.nav-panel'),
      $nav = $('#nav'),
      $navLi = $nav.find('li').data('status', 'open'),
      $searchPanel = $('.search-panel');

  // ===== 捲動位置記憶 / 還原（避免開/關選單造成位移） =====
  var __lastScrollY = 0;
  function rememberScroll() { __lastScrollY = window.scrollY || window.pageYOffset || 0; }
  function restoreScroll()  { window.scrollTo(0, __lastScrollY); }

  // ===== 全域防跳頂：攔截空錨點（若站內仍使用 <a href="#"> 作為按鈕）=====
  $(document).on('click', 'a[href="#"], a[href=""]', function (e) {
    e.preventDefault();
  });

  // ===== 主選單重置（關第二層）=====
  function nav_reset() {
    $navLi.data('status', 'open').removeClass('open').find('.nav-second').hide();
  }

  // ===== Footer「回頂部」：保留原本行為 =====
  $('#footer .top-button').on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 'slow');
  });

  // ===== 主選單按鈕開合（漢堡） =====
  $('.nav-button')
    .data('status', 'open')
    .on('click', function (e) {
      e.preventDefault();

      // 不再捲到頂，改記錄並維持原位
      rememberScroll();

      nav_reset();
      $searchPanel.removeClass('toggle');
      // ❌ 移除：$('html, body').animate({ scrollTop: 0 }, 'slow');

      var $ele = $(this);
      if ($ele.data('status') === 'open') {
        $ele.data('status', 'close').find('.fa-bars').removeClass('fa-bars').addClass('fa-times');
        $navPanel.addClass('toggle');
        $('.main-panel').addClass('toggle');
        $pageWrap.css('min-height', $navPanel.height() + 48);
      } else {
        $ele.data('status', 'open').find('.fa-times').removeClass('fa-times').addClass('fa-bars');
        $navPanel.removeClass('toggle');
        $pageWrap.css('min-height', 'auto');
        $('.main-panel').removeClass('toggle');
      }

      // 還原視口位置
      restoreScroll();
    });

  // ===== 點其他地方關閉主選單 =====
  $("body > div.header > div > p,body > div.header > div > div.toolbar,body > div.adv,body > div.container")
    .on('click', function (event) {
      if ($navPanel.hasClass('toggle')) {
        event.preventDefault();
        nav_button_close();
      }
    });

  function nav_button_close() {
    // 不再捲到頂，改記錄並維持原位
    rememberScroll();

    nav_reset();
    $searchPanel.removeClass('toggle');
    // ❌ 移除：$('html, body').animate({ scrollTop: 0 }, 'slow');

    var $ele = $('.nav-button');
    $ele.data('status', 'open').find('.fa-times').removeClass('fa-times').addClass('fa-bars');
    $navPanel.removeClass('toggle');
    $pageWrap.css('min-height', 'auto');
    $('.main-panel').removeClass('toggle');

    // 還原視口位置
    restoreScroll();
  }

  // ===== 主選單若有第二層/第三層，加上箭頭樣式 =====
  $navLi.each(function () {
    if ($(this).find('.nav-second')[0]) $(this).addClass('nav-first');
  });
  $navLi.each(function () {
    if ($(this).find('.nav-3')[0]) $(this).addClass('nav-first');
  });

  // ===== 主選單第二層開合 =====
  var num; // 注意：此 num 與下方第三層的 num 作用域分開
  $('#nav h2 > a').on('click', function (e) {
    e.preventDefault();

    var $ele = $(this), $eleLi = $ele.parents('li');
    if ($eleLi.find('.nav-second')[0]) {
      if ($eleLi.data('status') === 'open') {
        $eleLi.data('status', 'close').addClass('open').find('.nav-second').show();
        $pageWrap.css('min-height', $('.nav-panel').height() + 48);
        num = $pageWrap.height();
      } else {
        $eleLi.data('status', 'open').removeClass('open').find('.nav-second').hide();
        var $secondH = $eleLi.find('.nav-second').height() + 10;
        $pageWrap.css('min-height', num - $secondH);
      }
    } else {
      // 沒第二層，照常導頁
      location.href = $ele.attr('href');
    }
  });

  // ===== 主選單第三層開合 =====
  var num3; // 與上方 num 分離，避免覆蓋
  $('#nav .reset li .nav-second .reset li > a').on('click', function (e) {
    const $ele = $(this);
    const $eleLi = $ele.parent('li');

    const isMiddleClick = e.which === 2;
    const isBlankTarget = $ele.attr('target') === '_blank';

    if ($eleLi.find('.nav-3').length > 0) {
      // 只有不是新分頁/中鍵時才攔截
      if (!isMiddleClick && !isBlankTarget) e.preventDefault();

      if ($eleLi.data('status') === 'open') {
        $eleLi.data('status', 'close').addClass('open').find('.nav-3').show();
        $pageWrap.css('min-height', $('.nav-panel').height() + 48);
        num3 = $pageWrap.height();
      } else {
        $eleLi.data('status', 'open').removeClass('open').find('.nav-3').hide();
        const $thirdH = $eleLi.find('.nav-3').height() + 10;
        $pageWrap.css('min-height', num3 - $thirdH);
      }
    } else {
      // 沒有 nav-3，不攔截，讓超連結正常執行
    }
  });

  // ===== 搜尋功能開合 =====
  $('.search-button').on('click', function (e) {
    e.preventDefault();
    nav_reset();
    $searchPanel.toggleClass('toggle');
    $('.main-panel').removeClass('toggle');
    $('.nav-button').data('status', 'open').find('.fa-times').removeClass('fa-times').addClass('fa-bars');
    $navPanel.removeClass('toggle');
    $pageWrap.css('min-height', 'auto');
  });
});
