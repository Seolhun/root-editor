import type { NextMiddleware, NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export const middleware: NextMiddleware = async (req: NextRequest) => {
  try {
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
  }
};

export const config = {
  /**
   * @description
   * api, _next/static, _next/image, favicon.ico, robots.txt, mockServiceWorker.js, manifest.json, manifest/* 를 제외한 모든 요청을 middleware로 처리합니다.
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|mockServiceWorker.js|manifest.json|manifest/*).*)',
  ],
};
