import passport from "passport";
import { ExtractJwt, Strategy as jwtStrategy } from "passport-jwt";
import User from "../models/User";

function setJwtStrategy() {
  const secret = process.env.SECRET;
  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  passport.use(
    new jwtStrategy(params, async function (payload, done) {
      try {
        const user = await User.findById(payload.id).lean();
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}
export default setJwtStrategy;

//{ ExtractJwt, Strategy as JWTStrategy }: Importujemy funkcję ExtractJwt i Strategy z biblioteki passport-jwt. ExtractJwt wyciąga token z żądania, a Strategy (przemianowana tutaj na JWTStrategy) definiuje strategię autoryzacji za pomocą tokenu.

//Ten kod definiuje strategię autoryzacji JWT (JSON Web Token) dla Passporta, która sprawdza token dostarczony przez użytkownika i weryfikuje, czy użytkownik istnieje w bazie danych.

// Wywołanie strategii jwt w authMiddleware: W middleware, gdy używasz passport.authenticate("jwt", ...), Passport wie, że "jwt" odnosi się do strategii zdefiniowanej w passport.use(new JWTStrategy(...)). Automatycznie używa strategii skojarzonej z "jwt" i wykonuje jej logikę.

//params: Obiekt z ustawieniami strategii.
// secretOrKey: Klucz tajny, który pozwala zweryfikować podpis tokenu JWT.
// sposób wyciągania tokenu = jwtFromRequest: Funkcja ExtractJwt.fromAuthHeaderAsBearerToken() wyciąga token z nagłówka  Authorization w żądaniu HTTP, gdzie token jest przesyłany w formacie Bearer <token>.

// utworzenie nowej strategii JWT
// params: Ustawienia strategii (sekret i sposób wyciągania tokenu).
// async function (payload, done): Funkcja zwrotna (callback), która wykonuje się po odczytaniu tokenu JWT. payload to zawartość tokenu, czyli dane użytkownika, które zostały zakodowane podczas generowania tokenu.

//wyszukiwanie użytkownika w bazie danych, payload to zdekodowana część tokenu JWT, która zawiera dane użytkownika lub inne informacje.

//await User.findById(payload.id).lean(): Szuka użytkownika w bazie danych na podstawie id z payload (czyli informacji w tokenie). lean() optymalizuje wyszukiwanie, zwracając prosty obiekt JavaScript bez dodatkowych funkcji Mongoose.

// funkcja done (callback): 1 parametr to error, 2 user,  3 info.
// null oznacza że nie było errora, false że nie ma użytkownika.
//1 błąd.
