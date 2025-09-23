"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDB() {
  const [status, setStatus] = useState<string>('연결 테스트 중...');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // 1. 기본 연결 테스트
      const { error } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1);

      if (error) {
        setStatus(`❌ 연결 실패: ${error.message}`);
        return;
      }

      setStatus('✅ Supabase 연결 성공!');

      // 2. 테이블 목록 조회
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_table_names');

      if (!tablesError && tablesData) {
        setTables(tablesData);
      }

    } catch (err) {
      setStatus(`❌ 연결 오류: ${err}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase 연결 테스트</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">연결 상태:</h2>
        <p className="text-lg">{status}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">연결 정보:</h2>
        <ul className="list-disc list-inside">
          <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</li>
          <li>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</li>
        </ul>
      </div>

      {tables.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">데이터베이스 테이블:</h2>
          <ul className="list-disc list-inside">
            {tables.map((table, index) => (
              <li key={index}>{table}</li>
            ))}
          </ul>
        </div>
      )}

      <button 
        onClick={testConnection}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        다시 테스트
      </button>
    </div>
  );
}
