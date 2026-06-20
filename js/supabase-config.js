// ============ Supabase 云数据库配置 ============
// 请按照部署指南填写以下两个值
// 获取路径：Supabase Dashboard > Project Settings > API
// 1. Project URL → 填入 SUPABASE_URL
// 2. anon public key → 填入 SUPABASE_ANON_KEY

const SUPABASE_URL = 'https://jzjywwubjcccbtxjbjs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_K7v8hMp5DwkUoZ63SP1_0g_jOq8e8s7';

// 初始化 Supabase 客户端
let supabase = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// 检查是否已配置
function checkSupabaseConfig() {
  if (!supabase) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:9999;padding:20px;';
    overlay.innerHTML = `
      <div style="background:white;border-radius:16px;padding:32px;max-width:400px;text-align:center;">
        <div style="font-size:32px;margin-bottom:16px;">⚠️</div>
        <div style="font-size:18px;font-weight:600;margin-bottom:12px;">数据库尚未配置</div>
        <div style="font-size:14px;color:#666;line-height:1.8;margin-bottom:20px;">
          管理员需要完成 Supabase 云数据库配置后才能使用。<br>
          请参考部署指南中的「Supabase 配置步骤」。
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="padding:10px 24px;background:#f5f5f5;border:none;border-radius:8px;cursor:pointer;font-size:14px;">知道了</button>
      </div>
    `;
    document.body.appendChild(overlay);
    return false;
  }
  return true;
}
