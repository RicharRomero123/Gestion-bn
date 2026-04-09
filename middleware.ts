import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Intentamos obtener el token de las Cookies
  const token = request.cookies.get('token')?.value;

  // 2. Obtenemos la ruta a la que intenta entrar el usuario
  const { pathname } = request.nextUrl;

  // 3. Definimos qué rutas queremos proteger
  // Agregué /dashboard por si la usas, y las subrutas con :path*
  const protectedRoutes = ['/indecopi', '/abonos', '/dashboard'];

  // Lógica A: Si intenta entrar a ruta protegida SIN TOKEN
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      // Lo mandamos al login con un parámetro de error para avisarle
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Lógica B: Si ya TIENE TOKEN e intenta ir al login, lo mandamos al dashboard
  // Esto evita que un usuario ya logueado vea el formulario de login de nuevo
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/indecopi', request.url));
  }

  return NextResponse.next();
}

// 4. EL MATCHER: Configura dónde debe activarse este portero
// Esto hace que el middleware NO corra en imágenes, scripts o archivos estáticos (optimiza)
export const config = {
  matcher: [
    '/indecopi/:path*', 
    '/abonos/:path*', 
    '/dashboard/:path*', 
    '/login'
  ],
};