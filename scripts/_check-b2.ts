import * as fs from 'fs'; import * as path from 'path';
function loadEnv(){const ep=path.join(process.cwd(),'.env.local');if(!fs.existsSync(ep))return;const c=fs.readFileSync(ep,'utf8');for(const l of c.split('\n')){const t=l.trim();if(!t||t.startsWith('#'))continue;const i=t.indexOf('=');if(i<0)continue;process.env[t.slice(0,i).trim()]=t.slice(i+1).trim();}}
loadEnv();
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const COURSE_ID = 'a1000000-0000-0000-0000-000000000004'; // B2 Upper-Intermediate

async function main(){
  const {data:modules}=await supabase.from('english_modules').select('id,title,order_index').eq('course_id',COURSE_ID).order('order_index');
  console.log(`\nB2 Upper-Intermediate — ${modules?.length} modules`);
  
  for(const mod of modules||[]){
    const {data:lessons}=await supabase.from('english_lessons').select('id,title,order_index').eq('module_id',mod.id).order('order_index');
    const lessonIds=(lessons||[]).map(l=>l.id);
    
    let quizCount=0;
    if(lessonIds.length>0){
      const {data:quizzes}=await supabase.from('english_quizzes').select('lesson_id').in('lesson_id',lessonIds);
      const hasQuiz=new Set((quizzes||[]).map(q=>q.lesson_id));
      quizCount=hasQuiz.size;
    }
    
    console.log(`  Mod ${mod.order_index}: "${mod.title}" — ${lessons?.length} lessons, ${quizCount} quizzes`);
    for(const l of lessons||[]){
      console.log(`    [${l.id}] ${l.title}`);
    }
  }
}
main();
