import styled from 'styled-components';
import { useStore } from '../../store-simple';
import { 
  BiCube, 
  BiLayer, 
  BiWindow, 
  BiRectangle, 
  BiChevronRight, 
  BiChevronDown 
} from 'react-icons/bi';
import { useState } from 'react';

const TreeContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const TreeTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  color: #333;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 0.5rem;
`;

const TreeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

interface TreeItemProps {
  $isSelected: boolean;
}

const TreeItem = styled.li<TreeItemProps>`
  padding: 0.3rem 0;
  font-size: 0.9rem;
  color: ${props => props.$isSelected ? '#ff8c00' : '#555'};
  font-weight: ${props => props.$isSelected ? '600' : 'normal'};
  cursor: pointer;
  border-radius: 4px;
  padding-left: 0.5rem;
  
  &:hover {
    background-color: #f8f9fa;
    color: #ff8c00;
  }
  
  ${props => props.$isSelected && `
    background-color: #fff3e0;
    color: #ff8c00;
    border-left: 3px solid #ff8c00;
  `}
`;

const TreeItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex: 1;
  padding: 0.2rem;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const TreeItemChildren = styled.ul`
  list-style: none;
  padding-left: 1.5rem;
  margin: 0.2rem 0 0 0;
`;

const ExpandIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(74, 135, 185, 0.1);
    border-radius: 2px;
  }
`;

const BasicElementTree = () => {
  const { selectedElement, setSelectedElement, building, zone } = useStore();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'building': true,
    'default-zone': true,
    'wall-1': false,
    'wall-2': false,
    'wall-3': false,
    'wall-4': false
  });
  
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems({
      ...expandedItems,
      [id]: !expandedItems[id]
    });
  };
  
  const isSelected = (type: string, id: string) => 
    selectedElement?.type === type && selectedElement?.id === id;
  
  return (
    <TreeContainer>
      <TreeTitle>Modelo 3D</TreeTitle>
      
      <TreeList>
        {/* Edifício */}
        <TreeItem 
          $isSelected={isSelected('building', 'main-building')} 
          onClick={() => {}}
        >
          <TreeItemContent
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement({ type: 'building', id: 'main-building', name: building.name });
            }}
          >
            <ExpandIcon onClick={(e) => toggleExpand('building', e)}>
              {expandedItems['building'] 
                ? <BiChevronDown size={14} /> 
                : <BiChevronRight size={14} />}
            </ExpandIcon>
            <BiCube size={16} /> {building.name}
          </TreeItemContent>
          
          {expandedItems['building'] && (
            <TreeItemChildren>
              {/* Zona */}
              <TreeItem 
                $isSelected={isSelected('zone', 'default-zone')} 
                onClick={() => {}}
              >
                <TreeItemContent
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedElement({ type: 'zone', id: 'default-zone', name: zone.name });
                  }}
                >
                  <ExpandIcon onClick={(e) => toggleExpand('default-zone', e)}>
                    {expandedItems['default-zone'] 
                      ? <BiChevronDown size={14} /> 
                      : <BiChevronRight size={14} />}
                  </ExpandIcon>
                  <BiCube size={16} /> {zone.name}
                </TreeItemContent>
                
                {expandedItems['default-zone'] && (
                  <TreeItemChildren>
                    <TreeItem 
                      $isSelected={isSelected('surface', 'floor')} 
                      onClick={() => {}}
                    >
                      <TreeItemContent
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement({ type: 'surface', id: 'floor', name: 'Piso' });
                        }}
                      >
                        <div style={{ width: '16px' }}></div>
                        <BiRectangle size={14} /> Piso
                      </TreeItemContent>
                    </TreeItem>
                    
                    <TreeItem 
                      $isSelected={isSelected('surface', 'ceiling')} 
                      onClick={() => {}}
                    >
                      <TreeItemContent
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElement({ type: 'surface', id: 'ceiling', name: 'Teto' });
                        }}
                      >
                        <div style={{ width: '16px' }}></div>
                        <BiRectangle size={14} /> Teto
                      </TreeItemContent>
                    </TreeItem>
                    
                    {/* Paredes numeradas */}
                    {[1, 2, 3, 4].map(wallNumber => {
                      const wallId = `wall-${wallNumber}`;
                      const windowId = `window-${wallNumber}`;
                      const wallName = `Parede ${wallNumber}`;
                      const windowName = `Janela ${wallNumber}`;
                      
                      return (
                        <TreeItem 
                          key={wallId}
                          $isSelected={isSelected('wall', wallId)} 
                          onClick={() => {}}
                        >
                          <TreeItemContent
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedElement({ type: 'wall', id: wallId, name: wallName });
                            }}
                          >
                            <ExpandIcon onClick={(e) => toggleExpand(wallId, e)}>
                              {expandedItems[wallId] 
                                ? <BiChevronDown size={14} /> 
                                : <BiChevronRight size={14} />}
                            </ExpandIcon>
                            <BiLayer size={14} /> {wallName}
                          </TreeItemContent>
                          
                          {expandedItems[wallId] && (
                            <TreeItemChildren>
                              <TreeItem 
                                $isSelected={isSelected('window', windowId)} 
                                onClick={() => {}}
                              >
                                <TreeItemContent
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedElement({ type: 'window', id: windowId, name: windowName });
                                  }}
                                >
                                  <div style={{ width: '16px' }}></div>
                                  <BiWindow size={14} /> {windowName}
                                </TreeItemContent>
                              </TreeItem>
                            </TreeItemChildren>
                          )}
                        </TreeItem>
                      );
                    })}
                  </TreeItemChildren>
                )}
              </TreeItem>
            </TreeItemChildren>
          )}
        </TreeItem>
      </TreeList>
      
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#666', 
        marginTop: 'auto',
        padding: '0.5rem',
        background: '#fff3cd',
        borderRadius: '4px',
        border: '1px solid #ffeaa7'
      }}>
        <strong>💡 Dica:</strong> Clique nos elementos para selecioná-los e expandir para ver sub-elementos.
      </div>
    </TreeContainer>
  );
};

export default BasicElementTree;
