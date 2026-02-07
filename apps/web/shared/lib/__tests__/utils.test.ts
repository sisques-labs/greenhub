import { cn, paginate } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('foo', 'bar')
      expect(result).toBe('foo bar')
    })

    it('should handle conditional class names', () => {
      const result = cn('foo', false && 'bar', 'baz')
      expect(result).toBe('foo baz')
    })

    it('should merge Tailwind classes with twMerge', () => {
      const result = cn('px-2 py-1', 'px-4')
      expect(result).toBe('py-1 px-4')
    })

    it('should handle undefined and null values', () => {
      const result = cn('foo', undefined, null, 'bar')
      expect(result).toBe('foo bar')
    })

    it('should handle empty strings', () => {
      const result = cn('foo', '', 'bar')
      expect(result).toBe('foo bar')
    })
  })

  describe('paginate', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    it('should paginate items correctly for first page', () => {
      const result = paginate(items, 1, 5)

      expect(result.items).toEqual([1, 2, 3, 4, 5])
      expect(result.totalPages).toBe(2)
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(5)
    })

    it('should paginate items correctly for second page', () => {
      const result = paginate(items, 2, 5)

      expect(result.items).toEqual([6, 7, 8, 9, 10])
      expect(result.totalPages).toBe(2)
      expect(result.startIndex).toBe(5)
      expect(result.endIndex).toBe(10)
    })

    it('should handle page with fewer items than perPage', () => {
      const result = paginate(items, 2, 7)

      expect(result.items).toEqual([8, 9, 10])
      expect(result.totalPages).toBe(2)
      expect(result.startIndex).toBe(7)
      expect(result.endIndex).toBe(14)
    })

    it('should handle empty array', () => {
      const result = paginate([], 1, 5)

      expect(result.items).toEqual([])
      expect(result.totalPages).toBe(0)
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(5)
    })

    it('should handle single page', () => {
      const smallItems = [1, 2, 3]
      const result = paginate(smallItems, 1, 5)

      expect(result.items).toEqual([1, 2, 3])
      expect(result.totalPages).toBe(1)
      expect(result.startIndex).toBe(0)
      expect(result.endIndex).toBe(5)
    })

    it('should handle perPage of 1', () => {
      const result = paginate([1, 2, 3], 2, 1)

      expect(result.items).toEqual([2])
      expect(result.totalPages).toBe(3)
      expect(result.startIndex).toBe(1)
      expect(result.endIndex).toBe(2)
    })

    it('should work with different data types', () => {
      const stringItems = ['a', 'b', 'c', 'd', 'e']
      const result = paginate(stringItems, 1, 3)

      expect(result.items).toEqual(['a', 'b', 'c'])
      expect(result.totalPages).toBe(2)
    })

    it('should work with object arrays', () => {
      const objectItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ]
      const result = paginate(objectItems, 1, 2)

      expect(result.items).toEqual([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ])
      expect(result.totalPages).toBe(2)
    })
  })
})
