export class Config {
  public static readonly OPENAI = {
    SUMMARY: {
      MODEL: 'gpt-4o-mini',
    },
    QUESTION: {
      MODEL: 'gpt-4o-mini',
    },
  };

  public static readonly NOTION_SENTENCES = {
    // 사용자가 던진 질문에 유사한 데이터를 거리 기반으로 검색할 때 반환할 데이터 갯수입니다.
    // ! 수가 너무 많거나 적으면 검색 정확도가 떨어질 수 있습니다.
    SEARCH_LIMIT: 5,

    // 노션 문서 데이터 동기화 시 최대 대기 시간입니다.
    SYNC_MAX_WAIT_TIME: 1000 * 60 * 2, // 2분

    // 동기화 중에서 머무를 수 있는 최대 시간입니다.
    SYNC_DATA_MAX_LIFETIME: 1000 * 60 * 60,
  };
}
