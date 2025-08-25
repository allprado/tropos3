import styled from 'styled-components';
import { useStore } from '../../store';
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
  border-bottom: 1px solid #e0e0e0;
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
  isSelected: boolean;
}

const TreeItem = styled.li<TreeItemProps>`
  padding: 0.3rem 0;
  font-size: 0.9rem;
  color: ${props => props.isSelected ? '#4a87b9' : '#555'};
  font-weight: ${props => props.isSelected ? '500' : 'normal'};
  cursor: pointer;
  
  &:hover {
    color: #4a87b9;
  }
`;

const TreeItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const TreeItemChildren = styled.ul`
  list-style: none;
  padding-left: 1.5rem;
  margin: 0.2rem 0 0 0;
`;

const ElementTree = () => {
  const { selectedElement, setSelectedElement } = useStore();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'default-zone': true
  });
  
  const toggleExpand = (id: string) => {
    setExpandedItems({
      ...expandedItems,
      [id]: !expandedItems[id]
    });
  };
  
  return (
    <TreeContainer>
      <TreeTitle>Elementos</TreeTitle>
      
      <TreeList>
        <TreeItem 
          isSelected={selectedElement?.type === 'zone' && selectedElement.id === 'default-zone'} 
          onClick={() => setSelectedElement({ type: 'zone', id: 'default-zone', name: 'Zona Padrão' })}
        >
          <TreeItemContent>
            {expandedItems['default-zone'] 
              ? <BiChevronDown onClick={(e) => { e.stopPropagation(); toggleExpand('default-zone'); }} /> 
              : <BiChevronRight onClick={(e) => { e.stopPropagation(); toggleExpand('default-zone'); }} />}
            <BiCube /> Zona Padrão
          </TreeItemContent>
          
          {expandedItems['default-zone'] && (
            <TreeItemChildren>
              <TreeItem 
                isSelected={selectedElement?.type === 'surface' && selectedElement.id === 'floor'} 
                onClick={() => setSelectedElement({ type: 'surface', id: 'floor', name: 'Piso' })}
              >
                <TreeItemContent>
                  <BiRectangle /> Piso
                </TreeItemContent>
              </TreeItem>
              
              <TreeItem 
                isSelected={selectedElement?.type === 'surface' && selectedElement.id === 'ceiling'} 
                onClick={() => setSelectedElement({ type: 'surface', id: 'ceiling', name: 'Teto' })}
              >
                <TreeItemContent>
                  <BiRectangle /> Teto
                </TreeItemContent>
              </TreeItem>
              
              <TreeItem 
                isSelected={selectedElement?.type === 'wall' && selectedElement.id === 'north-wall'} 
                onClick={() => setSelectedElement({ type: 'wall', id: 'north-wall', name: 'Parede Norte' })}
              >
                <TreeItemContent>
                  {expandedItems['north-wall'] 
                    ? <BiChevronDown onClick={(e) => { e.stopPropagation(); toggleExpand('north-wall'); }} /> 
                    : <BiChevronRight onClick={(e) => { e.stopPropagation(); toggleExpand('north-wall'); }} />}
                  <BiLayer /> Parede Norte
                </TreeItemContent>
                
                {expandedItems['north-wall'] && (
                  <TreeItemChildren>
                    <TreeItem 
                      isSelected={selectedElement?.type === 'window' && selectedElement.id === 'north-window'} 
                      onClick={() => setSelectedElement({ type: 'window', id: 'north-window', name: 'Janela Norte' })}
                    >
                      <TreeItemContent>
                        <BiWindow /> Janela Norte
                      </TreeItemContent>
                    </TreeItem>
                  </TreeItemChildren>
                )}
              </TreeItem>
              
              <TreeItem 
                isSelected={selectedElement?.type === 'wall' && selectedElement.id === 'south-wall'} 
                onClick={() => setSelectedElement({ type: 'wall', id: 'south-wall', name: 'Parede Sul' })}
              >
                <TreeItemContent>
                  {expandedItems['south-wall'] 
                    ? <BiChevronDown onClick={(e) => { e.stopPropagation(); toggleExpand('south-wall'); }} /> 
                    : <BiChevronRight onClick={(e) => { e.stopPropagation(); toggleExpand('south-wall'); }} />}
                  <BiLayer /> Parede Sul
                </TreeItemContent>
                
                {expandedItems['south-wall'] && (
                  <TreeItemChildren>
                    <TreeItem 
                      isSelected={selectedElement?.type === 'window' && selectedElement.id === 'south-window'} 
                      onClick={() => setSelectedElement({ type: 'window', id: 'south-window', name: 'Janela Sul' })}
                    >
                      <TreeItemContent>
                        <BiWindow /> Janela Sul
                      </TreeItemContent>
                    </TreeItem>
                  </TreeItemChildren>
                )}
              </TreeItem>
              
              <TreeItem 
                isSelected={selectedElement?.type === 'wall' && selectedElement.id === 'east-wall'} 
                onClick={() => setSelectedElement({ type: 'wall', id: 'east-wall', name: 'Parede Leste' })}
              >
                <TreeItemContent>
                  {expandedItems['east-wall'] 
                    ? <BiChevronDown onClick={(e) => { e.stopPropagation(); toggleExpand('east-wall'); }} /> 
                    : <BiChevronRight onClick={(e) => { e.stopPropagation(); toggleExpand('east-wall'); }} />}
                  <BiLayer /> Parede Leste
                </TreeItemContent>
                
                {expandedItems['east-wall'] && (
                  <TreeItemChildren>
                    <TreeItem 
                      isSelected={selectedElement?.type === 'window' && selectedElement.id === 'east-window'} 
                      onClick={() => setSelectedElement({ type: 'window', id: 'east-window', name: 'Janela Leste' })}
                    >
                      <TreeItemContent>
                        <BiWindow /> Janela Leste
                      </TreeItemContent>
                    </TreeItem>
                  </TreeItemChildren>
                )}
              </TreeItem>
              
              <TreeItem 
                isSelected={selectedElement?.type === 'wall' && selectedElement.id === 'west-wall'} 
                onClick={() => setSelectedElement({ type: 'wall', id: 'west-wall', name: 'Parede Oeste' })}
              >
                <TreeItemContent>
                  {expandedItems['west-wall'] 
                    ? <BiChevronDown onClick={(e) => { e.stopPropagation(); toggleExpand('west-wall'); }} /> 
                    : <BiChevronRight onClick={(e) => { e.stopPropagation(); toggleExpand('west-wall'); }} />}
                  <BiLayer /> Parede Oeste
                </TreeItemContent>
                
                {expandedItems['west-wall'] && (
                  <TreeItemChildren>
                    <TreeItem 
                      isSelected={selectedElement?.type === 'window' && selectedElement.id === 'west-window'} 
                      onClick={() => setSelectedElement({ type: 'window', id: 'west-window', name: 'Janela Oeste' })}
                    >
                      <TreeItemContent>
                        <BiWindow /> Janela Oeste
                      </TreeItemContent>
                    </TreeItem>
                  </TreeItemChildren>
                )}
              </TreeItem>
            </TreeItemChildren>
          )}
        </TreeItem>
      </TreeList>
    </TreeContainer>
  );
};

export default ElementTree;
