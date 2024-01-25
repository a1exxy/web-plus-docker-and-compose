import * as bcrypt from "bcrypt";

export const passwdCompare = (data: string, encrypted: string) => {
  // Проверка пароля
  return bcrypt.compareSync(data, encrypted);
};

export const createHash = (passwd) => {
  // создание хеша пароля
  return bcrypt.hashSync(passwd, parseInt(process.env.PASSWD_SALT, 10));
};
