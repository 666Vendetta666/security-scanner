
export function getUser(id: string) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);
}

const password = 'hardcoded123';
