import 'reflect-metadata';
import { createConnection } from 'typeorm';

const connection = createConnection();

// this file is require'd by the "console" task to help with the db connection
// you may also use it to try out code here,
// but do not commit any changes made here
