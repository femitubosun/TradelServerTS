export interface DbContextInterface {
  connect(): any;

  populateDb(): any;

  getEntityRepository(entity: any): any;

  getTransactionalQueryRunner(): any;
}
