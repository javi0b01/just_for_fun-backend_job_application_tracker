const jwt = require('jsonwebtoken');

export function getToken(payload: { id: string; profile: number }) {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      process.env.TOKEN_KEY,
      { expiresIn: '1d' },
      (err: any, token: any) => {
        if (err) {
          rej({ err });
        } else {
          res({ token });
        }
      }
    );
  });
}
