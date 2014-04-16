#include <stdio.h>

int* greater(int n[],int length,int value)
{
	int i,j;
	for(i=0;i<length;i++)
	{
		if(n[i]>value)
		{
			n[i]=n[i];
		}
		else
		{
			for(j=i-1;j<length-1;j++)
			{
				n[j]=n[j+1];
			}
		}
	}
    int *p = n;
    return p;
}

int length(int n[])
{
	int i,counter=0;
	for(i=0; i != ' /0 ' ;i++)
	{
		counter++;
	}
	return counter;
}

int main()
{
	int n[]= {1,2,3,5,46,12,45};
	greater(n,length(n),5);
}
