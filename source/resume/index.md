---
title: 个人简历
date: 2026-08-29 23:45:00
type: resume
comments: false
aside: false
---

<style>
.resume-page{display:grid;gap:20px}
.resume-intro{padding:28px 32px;border:1px solid rgba(125,143,165,.2);border-radius:8px;background:rgba(255,255,255,.94);box-shadow:0 16px 42px rgba(20,32,50,.08)}
.resume-intro h2{margin:0 0 8px;color:#172235;font-size:28px}.resume-intro>p{margin:0;color:#657086}
.resume-versions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:24px}
.resume-version{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:14px;width:100%;min-height:86px;padding:16px 18px;border:1px solid rgba(125,143,165,.22);border-radius:7px;color:#172235;background:#f7f9fb;text-align:left;cursor:pointer;transition:.2s}
.resume-version:hover{transform:translateY(-2px);border-color:rgba(14,143,136,.5)}.resume-version.is-active{border-color:#0e8f88;background:rgba(57,197,187,.1);box-shadow:inset 3px 0 #0e8f88}
.resume-version>i{display:grid;place-items:center;width:38px;height:38px;border-radius:6px;color:#fff;background:#172235}.resume-version.is-active>i{background:#0e8f88}
.resume-version strong,.resume-version small{display:block}.resume-version strong{margin-bottom:4px;font-size:16px}.resume-version small{color:#657086;font-size:12px}.resume-version .fa-check{visibility:hidden;color:#0e8f88}.resume-version.is-active .fa-check{visibility:visible}
.resume-toolbar{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 20px;border:1px solid rgba(125,143,165,.2);border-radius:8px;background:rgba(255,255,255,.94)}
.resume-current{display:grid;gap:2px}.resume-current strong{color:#172235}.resume-current span{color:#657086;font-size:13px}
.resume-actions{display:flex;gap:10px;flex-shrink:0}.resume-actions a{display:inline-flex;align-items:center;gap:8px;padding:10px 15px;border-radius:6px;font-weight:700}
.resume-primary{color:#fff!important;background:#172235}.resume-secondary{color:#0e8f88!important;border:1px solid rgba(14,143,136,.35);background:#fff}
.resume-viewer{overflow:hidden;height:calc(100vh - 210px);min-height:760px;border:1px solid rgba(125,143,165,.22);border-radius:8px;background:#e9edf2;box-shadow:0 18px 48px rgba(20,32,50,.09)}
.resume-viewer iframe{display:block;width:100%;height:100%;border:0}
[data-theme=dark] .resume-intro,[data-theme=dark] .resume-toolbar{border-color:rgba(255,255,255,.1);background:rgba(20,27,40,.94)}
[data-theme=dark] .resume-intro h2,[data-theme=dark] .resume-current strong{color:#edf4ff}[data-theme=dark] .resume-intro>p,[data-theme=dark] .resume-current span{color:#a8b5c7}
[data-theme=dark] .resume-version{border-color:rgba(255,255,255,.1);color:#edf4ff;background:#192233}[data-theme=dark] .resume-version small{color:#a8b5c7}[data-theme=dark] .resume-secondary{background:#192233}
@media(max-width:760px){.resume-intro{padding:22px}.resume-versions{grid-template-columns:1fr}.resume-toolbar{align-items:flex-start;flex-direction:column}.resume-actions{width:100%}.resume-actions a{flex:1;justify-content:center}.resume-viewer{height:70vh;min-height:520px}}
</style>

<div class="resume-page">
  <section class="resume-intro">
    <h2>个人简历</h2>
    <p>根据求职方向选择对应版本，支持在线预览与 PDF 下载。</p>
    <div class="resume-versions" role="tablist" aria-label="选择简历版本">
      <button class="resume-version is-active" type="button" role="tab" aria-selected="true" data-resume-src="/downloads/resume-client.pdf" data-resume-title="游戏客户端开发" data-resume-desc="Unity / C# / 客户端架构 / 移动端开发" data-download-name="游戏客户端开发-个人简历.pdf">
        <i class="fas fa-gamepad"></i><span><strong>游戏客户端开发</strong><small>Unity、C#、系统架构与项目经验</small></span><i class="fas fa-check"></i>
      </button>
      <button class="resume-version" type="button" role="tab" aria-selected="false" data-resume-src="/downloads/resume-system-designer.pdf" data-resume-title="游戏系统策划" data-resume-desc="系统拆解 / 玩法设计 / 技术沟通 / 游戏经历" data-download-name="游戏系统策划-个人简历.pdf">
        <i class="fas fa-diagram-project"></i><span><strong>游戏系统策划</strong><small>系统拆解、玩法设计与技术理解</small></span><i class="fas fa-check"></i>
      </button>
    </div>
  </section>

  <section class="resume-toolbar">
    <div class="resume-current"><strong id="resume-current-title">游戏客户端开发</strong><span id="resume-current-desc">Unity / C# / 客户端架构 / 移动端开发</span></div>
    <div class="resume-actions">
      <a class="resume-primary" id="resume-open" href="/downloads/resume-client.pdf" target="_blank" rel="noopener"><i class="fas fa-up-right-from-square"></i> 打开 PDF</a>
      <a class="resume-secondary" id="resume-download" href="/downloads/resume-client.pdf" download="游戏客户端开发-个人简历.pdf"><i class="fas fa-download"></i> 下载简历</a>
    </div>
  </section>

  <div class="resume-viewer">
    <iframe id="resume-frame" src="/downloads/resume-client.pdf#view=FitH" title="游戏客户端开发简历在线预览"></iframe>
  </div>
</div>

<script>
(function(){
  var buttons=document.querySelectorAll('.resume-version');
  var frame=document.getElementById('resume-frame');
  var openLink=document.getElementById('resume-open');
  var downloadLink=document.getElementById('resume-download');
  var title=document.getElementById('resume-current-title');
  var desc=document.getElementById('resume-current-desc');
  buttons.forEach(function(button){
    button.addEventListener('click',function(){
      var src=button.dataset.resumeSrc;
      buttons.forEach(function(item){item.classList.remove('is-active');item.setAttribute('aria-selected','false')});
      button.classList.add('is-active');button.setAttribute('aria-selected','true');
      title.textContent=button.dataset.resumeTitle;desc.textContent=button.dataset.resumeDesc;
      frame.src=src+'#view=FitH';frame.title=button.dataset.resumeTitle+'简历在线预览';
      openLink.href=src;downloadLink.href=src;downloadLink.setAttribute('download',button.dataset.downloadName);
    });
  });
})();
</script>
