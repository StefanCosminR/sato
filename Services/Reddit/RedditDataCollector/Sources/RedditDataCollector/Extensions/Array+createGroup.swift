// Create by Stefan Romanescu on 26/12/2019 
// Using Swift 5.0

extension Array {
    func createGroup(of elementsInGroup: Int) -> [ArraySlice<Element>] {
        if elementsInGroup >= count {
            return [self[...]]
        }
        
        var newArray: [ArraySlice<Element>] = []
        let guaranteedNumberOfGroups = count / elementsInGroup
        var lowerBound = 0
        var upperBound = elementsInGroup
        
        for _ in 0..<guaranteedNumberOfGroups {
            newArray.append(self[lowerBound..<upperBound])
            lowerBound = upperBound
            upperBound = upperBound + elementsInGroup
        }
        
        if lowerBound < count {
            newArray.append(self[lowerBound...])
        }
        
        return newArray
    }
}
