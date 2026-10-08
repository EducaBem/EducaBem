-- EducaBem: cancelar doação (passo 2 da conexão do app com o banco)
-- Rode no SQL Editor do Supabase DEPOIS dos 3 arquivos anteriores. Pode rodar uma vez só.
--
-- Só cancela doação da própria pessoa e só enquanto o status for 'registrada' (o livro ainda não saiu do ponto de coleta).
-- Desfaz tudo o que registrar_doacao() criou: eventos, livro, lançamento dos 50 pontos (e tira os pontos do total) e as notificações daquela doação.

create or replace function cancelar_doacao(p_doacao bigint) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_livro  bigint;
  v_status text;
  v_codigo text;
  v_pts    int;
begin
  if v_uid is null then raise exception 'Faça login'; end if;

  select livro_id, status, codigo into v_livro, v_status, v_codigo
  from doacoes where id = p_doacao and doador_id = v_uid for update;

  if v_livro is null then raise exception 'Doação não encontrada'; end if;
  if v_status <> 'registrada' then
    raise exception 'Este livro já saiu do ponto de coleta, então a doação não pode mais ser cancelada.';
  end if;

  delete from pontos_lancamentos
   where usuario_id = v_uid and origem = 'doacao' and referencia_id = p_doacao
  returning pontos into v_pts;
  if v_pts is not null then
    update usuarios set pontos_totais = greatest(pontos_totais - v_pts, 0) where id = v_uid;
  end if;

  delete from notificacoes where usuario_id = v_uid and tipo = 'status_doacao' and texto like '%' || v_codigo || '%';
  delete from doacoes where id = p_doacao;   -- doacao_eventos sai junto (on delete cascade)
  delete from livros  where id = v_livro;
end $$;

-- funções novas nascem liberadas para todo mundo: tranca e libera só para quem está logado
revoke all on function cancelar_doacao(bigint) from public, anon, authenticated;
grant execute on function cancelar_doacao(bigint) to authenticated;
