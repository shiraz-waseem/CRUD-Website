import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('tokenHttpInterceptor', token);
  req = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + token,
    },
  });
  return next(req);
};
