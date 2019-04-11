import { toggleSort, getSortDirection } from '@/helpers/handleSort';

describe('handleSort', () => {
  describe('toggleSort', () => {
    it('should add asc sort if not present', () => {
      expect(
        toggleSort([], 'name'),
      )
        .toEqual(
          ['name'],
        );
    });

    it('should turn asc to desc', () => {
      expect(
        toggleSort(['name'], 'name'),
      )
        .toEqual(
          ['-name'],
        );
    });

    it('should turn desc to asc', () => {
      expect(
        toggleSort(['-name'], 'name'),
      )
        .toEqual(
          ['name'],
        );
    });

    it('should turn asc to desc in multiple sorts', () => {
      expect(
        toggleSort(['name', 'date'], 'name'),
      )
        .toEqual(
          ['-name', 'date'],
        );
    });

    it('should turn desc to asc in multiple sorts', () => {
      expect(
        toggleSort(['-name', 'date'], 'name'),
      )
        .toEqual(
          ['name', 'date'],
        );
    });
  });

  describe('getSortDirection', () => {
    it('should return null if no sort', () => {
      expect(
        getSortDirection([], 'name'),
      ).toEqual(null);
    });

    it('should return asc', () => {
      expect(
        getSortDirection(['name'], 'name'),
      ).toEqual('asc');
    });

    it('should return desc', () => {
      expect(
        getSortDirection(['-name'], 'name'),
      ).toEqual('desc');
    });

    it('should return asc in multiple sorts', () => {
      expect(
        getSortDirection(['name', 'date'], 'name'),
      ).toEqual('asc');
    });

    it('should return desc in multiple sorts', () => {
      expect(
        getSortDirection(['-name', 'date'], 'name'),
      ).toEqual('desc');
    });
  });
});
