// ============ 通用工具 ============
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name) || '';
}

// ============ 问卷交互逻辑 ============
function initSurvey() {
  document.querySelectorAll('.option-group[data-type="radio"]').forEach(group => {
    const items = group.querySelectorAll('.option-item');
    items.forEach(item => {
      item.addEventListener('click', function() {
        items.forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        const questionId = this.closest('.question-item').dataset.qid;
        handleSkipLogic(questionId);
        updateProgress();
      });
    });
  });

  document.querySelectorAll('.option-group[data-type="checkbox"]').forEach(group => {
    const items = group.querySelectorAll('.option-item');
    const maxStr = group.dataset.max;
    const max = maxStr ? parseInt(maxStr) : 0;
    items.forEach(item => {
      item.addEventListener('click', function(e) {
        if (this.classList.contains('selected')) {
          this.classList.remove('selected');
        } else {
          if (max > 0) {
            const selected = group.querySelectorAll('.option-item.selected').length;
            if (selected >= max) {
              const hint = group.parentElement.querySelector('.option-max-hint');
              if (hint) {
                hint.classList.add('show');
                setTimeout(() => hint.classList.remove('show'), 2000);
              }
              return;
            }
          }
          this.classList.add('selected');
        }
        updateProgress();
      });
    });
  });

  document.querySelectorAll('.input-text').forEach(input => {
    input.addEventListener('input', updateProgress);
  });
}

function handleSkipLogic(questionId) {
  if (questionId === 'q9') {
    const selected = document.querySelector('[data-qid="q9"] .option-item.selected');
    const q10 = document.querySelector('[data-qid="q10"]');
    if (selected && selected.dataset.value === '还没有账号') {
      q10.classList.add('hidden');
    } else {
      q10.classList.remove('hidden');
    }
  }
  if (questionId === 'q21') {
    const selected = document.querySelector('[data-qid="q21"] .option-item.selected');
    const noAccount = selected && selected.dataset.value === '没有账号';
    ['q22', 'q23', 'q24', 'q26'].forEach(qid => {
      const el = document.querySelector(`[data-qid="${qid}"]`);
      if (el) {
        if (noAccount) el.classList.add('hidden');
        else el.classList.remove('hidden');
      }
    });
  }
  if (questionId === 'q27') {
    const selected = document.querySelector('[data-qid="q27"] .option-item.selected');
    const noAd = selected && selected.dataset.value === '从未投放';
    ['q29', 'q30', 'q31'].forEach(qid => {
      const el = document.querySelector(`[data-qid="${qid}"]`);
      if (el) {
        if (noAd) el.classList.add('hidden');
        else el.classList.remove('hidden');
      }
    });
  }
}

function updateProgress() {
  const totalQuestions = document.querySelectorAll('.question-item:not(.hidden)').length;
  const answered = countAnswered();
  const percent = totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0;
  const bar = document.querySelector('.progress-bar');
  if (bar) bar.style.width = percent + '%';
}

function countAnswered() {
  let count = 0;
  document.querySelectorAll('.question-item:not(.hidden)').forEach(q => {
    const hasRadio = q.querySelector('.option-item.selected');
    const hasText = q.querySelector('.input-text') && q.querySelector('.input-text').value.trim();
    if (hasRadio || hasText) count++;
  });
  return count;
}

// ============ 字段映射表 ============
const BOOKING_FIELD_MAP = {
  'q1': 'store_name', 'q2': 'city', 'q3': 'identity', 'q4': 'contact_name',
  'q5': 'contact_info', 'q6': 'main_business', 'q7': 'price_range',
  'q8': 'main_problem', 'q9': 'account_status', 'q10': 'ad_status',
  'q11': 'comm_method', 'q12': 'comm_time', 'q13': 'quick_question'
};

const DIAGNOSTIC_FIELD_MAP = {
  'q1': 'store_name', 'q2': 'city', 'q3': 'store_age', 'q4': 'store_area',
  'q5': 'categories', 'q6': 'business_model', 'q7': 'price_range',
  'q8': 'business_goal', 'q9': 'advantages', 'q10': 'popular_products',
  'q11': 'customer_concerns', 'q12': 'competitors',
  'q13': 'xhs_consults_30d', 'q14': 'xhs_visits_30d', 'q15': 'xhs_deals_30d',
  'q16': 'photo_count', 'q17': 'photo_auth', 'q18': 'weekly_materials',
  'q19': 'on_camera_person', 'q20': 'content_menpower',
  'q21': 'account_count', 'q22': 'account_names', 'q23': 'account_owners',
  'q24': 'post_frequency', 'q25': 'account_issues', 'q26': 'avg_exposure',
  'q27': 'ad_history', 'q28': 'ad_account', 'q29': 'ad_spend_90d',
  'q30': 'ad_results', 'q31': 'ad_no_data_reason', 'q32': 'ad_budget',
  'q33': 'ad_goal', 'q34': 'consult_handler', 'q35': 'response_time',
  'q36': 'project_contact', 'q37': 'monthly_shoot', 'q38': 'cooperation_period',
  'q39': 'agree_diagnosis', 'q40': 'agree_case'
};

function collectData(formType) {
  const fieldMap = formType === 'booking' ? BOOKING_FIELD_MAP : DIAGNOSTIC_FIELD_MAP;
  const data = {};
  document.querySelectorAll('.question-item').forEach(q => {
    const qid = q.dataset.qid;
    if (!qid) return;
    const field = fieldMap[qid];
    if (!field) return;
    if (q.classList.contains('hidden')) return;

    const selected = q.querySelectorAll('.option-item.selected');
    if (selected.length > 0) {
      const values = Array.from(selected).map(s => s.dataset.value);
      // 多选时用顿号拼接成字符串（数据库列为 TEXT 类型）
      data[field] = values.join('、');
      return;
    }
    const input = q.querySelector('.input-text');
    if (input && input.value.trim()) {
      data[field] = input.value.trim();
      return;
    }
    const combo = q.querySelector('.combo-input .input-text');
    if (combo && combo.value.trim()) {
      data[field] = combo.value.trim();
    }
  });
  return data;
}

function validateRequired() {
  let firstError = null;
  document.querySelectorAll('.question-item:not(.hidden)').forEach(q => {
    const required = q.dataset.required === 'true';
    if (!required) return;
    const hasRadio = q.querySelector('.option-item.selected');
    const hasText = q.querySelector('.input-text') && q.querySelector('.input-text').value.trim();
    if (!hasRadio && !hasText) {
      q.style.borderLeft = '3px solid #ff4d4f';
      q.style.paddingLeft = '12px';
      q.style.marginLeft = '-12px';
      if (!firstError) firstError = q;
    } else {
      q.style.borderLeft = '';
      q.style.paddingLeft = '';
      q.style.marginLeft = '';
    }
  });
  if (firstError) {
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

// ============ 提交（Supabase 云数据库） ============
async function submitForm(type) {
  if (!checkSupabaseConfig()) return;

  if (!validateRequired()) {
    alert('请完成所有必填题');
    return;
  }

  const data = collectData(type);
  console.log('[问卷提交] 表单类型:', type, '提交数据:', data);

  const btn = document.querySelector('.submit-btn');
  btn.disabled = true;
  btn.textContent = '提交中...';

  try {
    const tableName = type === 'booking' ? 'bookings' : 'diagnostics';
    const { data: result, error } = await supabase.from(tableName).insert(data).select();

    if (error) {
      console.error('[问卷提交] Supabase 错误:', error);
      throw error;
    }

    console.log('[问卷提交] 提交成功:', result);
    showSuccess(type);
  } catch (err) {
    console.error('[问卷提交] 提交失败:', err);
    alert('提交失败：' + (err.message || err.toString() || '请重试'));
    btn.disabled = false;
    btn.textContent = type === 'booking' ? '提交预约' : '提交诊断表';
  }
}

function showSuccess(type) {
  const overlay = document.querySelector('.success-overlay');
  if (overlay) {
    overlay.classList.add('show');
  }
}
